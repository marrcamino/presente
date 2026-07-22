<script lang="ts">
  import Cropper from "svelte-easy-crop";

  interface Props {
    imageSrc: string;
    onCrop: (blob: Blob) => void;
    onCancel: () => void;
  }

  let { imageSrc, onCrop, onCancel }: Props = $props();

  const OUTPUT_SIZE = 480;

  let dialogEl: HTMLDialogElement;
  let crop = $state({ x: 0, y: 0 });
  let zoom = $state(1);
  let croppedAreaPixels = $state<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  // Runs once, when this component instance is actually created —
  // no more "open" prop to track, no stale re-fires.
  $effect(() => {
    dialogEl?.showModal();
  });

  // NOTE: confirm the shape of `e` once you test this — should be
  // e.pixels per the docs, but if nothing crops, log(e) and adjust.
  function handleCropComplete(e: {
    pixels: { x: number; y: number; width: number; height: number };
  }) {
    croppedAreaPixels = e.pixels;
  }

  function handleConfirm() {
    if (!croppedAreaPixels) return;

    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = OUTPUT_SIZE;
      canvas.height = OUTPUT_SIZE;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(
        image,
        croppedAreaPixels!.x,
        croppedAreaPixels!.y,
        croppedAreaPixels!.width,
        croppedAreaPixels!.height,
        0,
        0,
        OUTPUT_SIZE,
        OUTPUT_SIZE,
      );

      canvas.toBlob(
        (blob) => {
          if (blob) onCrop(blob);
        },
        "image/jpeg",
        0.85,
      );
    };
    image.src = imageSrc;
  }
</script>

<dialog
  bind:this={dialogEl}
  class="w-full max-w-sm pt-safe p-4 text-foreground backdrop:bg-black/50 rounded-b-xl"
>
  <div class="flex flex-col gap-3">
    <h2 class="text-lg font-semibold mt-2" >Adjust Photo</h2>

    <div class="relative mx-auto h-72 w-72 overflow-hidden rounded-md bg-muted">
      <Cropper
        image={imageSrc}
        bind:crop
        bind:zoom
        aspect={1}
        cropShape="round"
        oncropcomplete={handleCropComplete}
      />
    </div>

    <label class="flex flex-col gap-1 text-sm">
      Zoom
      <input type="range" min="1" max="3" step="0.01" bind:value={zoom} />
    </label>

    <div class="mt-2 flex items-center gap-2">
      <button
        type="button"
        onclick={onCancel}
        class="ml-auto rounded-md border border-border px-3 py-2 text-sm"
      >
        Cancel
      </button>
      <button
        type="button"
        onclick={handleConfirm}
        class="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground"
      >
        Use Photo
      </button>
    </div>
  </div>
</dialog>
