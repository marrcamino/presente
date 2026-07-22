<script lang="ts">
  import PhotoCropDialog from "$lib/components/photo-crop-dialog.svelte";
  import { getDb } from "$lib/db";
  import { resolvePhotoSrc } from "$lib/photo";
  import { cleanupOrphanedPhotos } from "$lib/photo-cleanup";
  import { Camera } from "@lucide/svelte";
  import {
    BaseDirectory,
    mkdir,
    remove,
    writeFile,
  } from "@tauri-apps/plugin-fs";
  import { untrack } from "svelte";
  import { getOfficeContext } from "./context.svelte";

  const ctx = getOfficeContext();

  let dialogEl: HTMLDialogElement;
  let name = $state("");
  let submitting = $state(false);
  let error = $state("");
  let confirmingDelete = $state(false);

  // Photo state
  let photoPreviewUrl = $state<string | null>(null); // what's shown in the avatar circle
  let pendingPhotoBlob = $state<Blob | null>(null); // freshly cropped, not yet written to disk
  let cropDialogOpen = $state(false);
  let cropSourceUrl = $state<string | null>(null); // object URL fed into the cropper
  let fileInputEl: HTMLInputElement;

  const isEditing = $derived(ctx.openEmployee !== null);

  function handleFileSelected(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = ""; // reset so picking the same file again still fires "change"
    if (!file) return;

    cropSourceUrl = URL.createObjectURL(file);
    cropDialogOpen = true;
  }

  function handleCropped(blob: Blob) {
    pendingPhotoBlob = blob;
    if (photoPreviewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreviewUrl);
    }
    photoPreviewUrl = URL.createObjectURL(blob);
    cropDialogOpen = false;
    if (cropSourceUrl) {
      URL.revokeObjectURL(cropSourceUrl);
      cropSourceUrl = null;
    }
  }

  function handleCropCancel() {
    cropDialogOpen = false;
    if (cropSourceUrl) {
      URL.revokeObjectURL(cropSourceUrl);
      cropSourceUrl = null;
    }
  }

  async function savePhoto(
    employeeId: number,
    blob: Blob,
    previousPath: string | null,
  ): Promise<string> {
    await mkdir("employees", {
      baseDir: BaseDirectory.AppData,
      recursive: true,
    });
    const bytes = new Uint8Array(await blob.arrayBuffer());
    // Unique filename per save so photo_path always changes on update —
    // this is what makes row/dialog previews refresh instead of showing
    // a stale cached image at the same URL.
    const relativePath = `employees/${employeeId}-${Date.now()}.jpg`;
    await writeFile(relativePath, bytes, { baseDir: BaseDirectory.AppData });

    if (previousPath && previousPath !== relativePath) {
      try {
        await remove(previousPath, { baseDir: BaseDirectory.AppData });
      } catch {
        // old file may not exist; safe to ignore
      }
    }

    return relativePath;
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (!name.trim()) {
      error = "Name is required.";
      return;
    }

    submitting = true;
    error = "";

    try {
      const db = await getDb();
      let photoPath = ctx.openEmployee?.photo_path ?? null;

      if (isEditing && ctx.openEmployee) {
        if (pendingPhotoBlob) {
          photoPath = await savePhoto(
            ctx.openEmployee.id,
            pendingPhotoBlob,
            ctx.openEmployee.photo_path,
          );
        }

        await db.execute(
          "UPDATE employees SET name = ?, photo_path = ? WHERE id = ?",
          [name.trim(), photoPath, ctx.openEmployee.id],
        );
        ctx.updateEmployee({
          ...ctx.openEmployee,
          name: name.trim(),
          photo_path: photoPath,
        });
        cleanupOrphanedPhotos();
      } else {
        const result = await db.execute(
          "INSERT INTO employees (office_id, name) VALUES (?, ?)",
          [ctx.office.id, name.trim()],
        );
        const newId = result.lastInsertId!;

        if (pendingPhotoBlob) {
          photoPath = await savePhoto(newId, pendingPhotoBlob, null);
          await db.execute("UPDATE employees SET photo_path = ? WHERE id = ?", [
            photoPath,
            newId,
          ]);
        }

        ctx.addEmployee({
          id: newId,
          office_id: ctx.office.id,
          name: name.trim(),
          photo_path: photoPath,
          created_at: new Date().toISOString(),
        });
      }

      ctx.closeEmployeeDialog();
    } catch (err) {
      console.error(err);
      error = "Something went wrong. Please try again.";
    } finally {
      submitting = false;
    }
  }

  async function handleDelete() {
    if (!ctx.openEmployee) return;

    submitting = true;
    error = "";

    try {
      const db = await getDb();
      await db.execute("DELETE FROM employees WHERE id = ?", [
        ctx.openEmployee.id,
      ]);
      if (ctx.openEmployee.photo_path) {
        try {
          await remove(ctx.openEmployee.photo_path, {
            baseDir: BaseDirectory.AppData,
          });
        } catch {
          // ignore if file already gone
        }
      }
      ctx.removeEmployee(ctx.openEmployee.id);
      ctx.closeEmployeeDialog();
      cleanupOrphanedPhotos();
    } catch (err) {
      console.error(err);
      error = "Failed to delete employee.";
      confirmingDelete = false;
    } finally {
      submitting = false;
    }
  }

  $effect(() => {
    ctx.showEmployeeDialog;

    untrack(() => {
      if (!ctx.showEmployeeDialog) return;
      name = ctx.openEmployee?.name ?? "";
      error = "";
      confirmingDelete = false;
      pendingPhotoBlob = null;
      cropSourceUrl = null;
      cropDialogOpen = false;

      const existingPath = ctx.openEmployee?.photo_path ?? null;
      if (existingPath) {
        resolvePhotoSrc(existingPath).then((src) => {
          photoPreviewUrl = src;
        });
      } else {
        photoPreviewUrl = null;
      }
    });
  });

  $effect(() => {
    if (ctx.showEmployeeDialog) {
      dialogEl?.showModal();
    } else {
      dialogEl?.close();
    }
  });
</script>

<dialog
  bind:this={dialogEl}
  class="w-full max-w-sm rounded-b-xl pt-safe p-4 text-foreground backdrop:bg-black/50"
>
  <form onsubmit={handleSubmit} class="flex flex-col gap-3">
    <h2
      class="text-lg font-semibold mt-2"
    >
      {isEditing ? "Edit Employee" : "Add Employee"}
    </h2>

    <div class="flex justify-center">
      <button
        type="button"
        onclick={() => fileInputEl?.click()}
        class="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-muted"
      >
        {#if photoPreviewUrl}
          <img
            src={photoPreviewUrl}
            alt="Employee"
            class="h-full w-full object-cover"
          />
        {:else}
          <Camera size={24} class="text-muted-foreground" />
        {/if}
      </button>

      <input
        bind:this={fileInputEl}
        type="file"
        accept="image/png,image/jpeg"
        class="hidden"
        onchange={handleFileSelected}
      />
    </div>

    <label class="flex flex-col gap-1 text-sm">
      Name
      <input
        type="text"
        bind:value={name}
        class="rounded-md border aria-invalid:border-destructive focus-visible:border-primary outline-0 focus:border-primary border-input bg-background px-3 py-2 text-sm"
        placeholder="Full name"
        required
      />
    </label>

    {#if error}
      <p class="text-sm text-destructive">{error}</p>
    {/if}

    {#if confirmingDelete}
      <div
        class="mt-2 flex flex-col gap-2 rounded-md border border-destructive p-3"
      >
        <p class="text-sm">Delete this employee? This can't be undone.</p>
        <div class="flex items-center gap-2">
          <button
            type="button"
            onclick={() => (confirmingDelete = false)}
            disabled={submitting}
            class="rounded-md border border-border px-3 py-2 text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            onclick={handleDelete}
            disabled={submitting}
            class="ml-auto rounded-md bg-destructive px-3 py-2 text-sm text-destructive-foreground"
          >
            {submitting ? "Deleting..." : "Confirm Delete"}
          </button>
        </div>
      </div>
    {:else}
      <div class="mt-2 flex items-center gap-2">
        {#if isEditing}
          <button
            type="button"
            onclick={() => (confirmingDelete = true)}
            disabled={submitting}
            class="rounded-md border border-destructive px-3 py-2 text-sm text-destructive"
          >
            Delete
          </button>
        {/if}

        <button
          type="button"
          onclick={() => ctx.closeEmployeeDialog()}
          disabled={submitting}
          class="ml-auto rounded-md border border-border px-3 py-2 text-sm"
        >
          Close
        </button>

        <button
          type="submit"
          disabled={submitting}
          class="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground"
        >
          {isEditing ? "Save" : "Add"}
        </button>
      </div>
    {/if}
  </form>
</dialog>

{#if cropDialogOpen && cropSourceUrl}
  <PhotoCropDialog
    imageSrc={cropSourceUrl}
    onCrop={handleCropped}
    onCancel={handleCropCancel}
  />
{/if}
