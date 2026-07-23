<script lang="ts">
  type Props = {
    letters: string[];
    onselect: (letter: string) => void;
  };

  let { letters, onselect }: Props = $props();

  let containerEl: HTMLElement;
  let letterEls: HTMLElement[] = $state([]);
  let activeLetter: string | null = $state(null);
  let clearTimeout: ReturnType<typeof setTimeout> | undefined;

  function letterFromPointer(clientY: number): string | null {
    let closestLetter: string | null = null;
    let closestDistance = Infinity;

    for (let i = 0; i < letterEls.length; i++) {
      const el = letterEls[i];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      const distance = Math.abs(clientY - centerY);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestLetter = letters[i];
      }
    }

    return closestLetter;
  }

  function handlePointerDown(e: PointerEvent) {
    clearTimeout && clearInterval(clearTimeout);
    containerEl.setPointerCapture(e.pointerId);
    updateFromEvent(e);
  }

  function handlePointerMove(e: PointerEvent) {
    if (e.buttons === 0 && e.pointerType === "mouse") return;
    updateFromEvent(e);
  }

  function handlePointerUp() {
    // Small delay so a quick tap still shows a visible "pressed" flash
    clearTimeout = setTimeout(() => {
      activeLetter = null;
    }, 150);
  }

  function updateFromEvent(e: PointerEvent) {
    const letter = letterFromPointer(e.clientY);
    if (letter && letter !== activeLetter) {
      activeLetter = letter;
      onselect(letter);
    }
  }
</script>

<div
  bind:this={containerEl}
  onpointerdown={handlePointerDown}
  onpointermove={handlePointerMove}
  onpointerup={handlePointerUp}
  onpointercancel={handlePointerUp}
  role="slider"
  tabindex="0"
  aria-label="Jump to letter"
  aria-orientation="vertical"
  aria-valuemin={0}
  aria-valuemax={letters.length - 1}
  aria-valuenow={letters.indexOf(activeLetter ?? letters[0])}
  aria-valuetext={activeLetter ?? letters[0]}
  class="absolute right-0 top-0 bottom-0 flex flex-col items-center justify-center gap-2 px-2 touch-none select-none"
>
  {#each letters as letter, i (letter)}
    {@const isActive = activeLetter === letter}
    <span
      bind:this={letterEls[i]}
      class="text-[10px] font-medium leading-none transition-colors
      {isActive ? 'text-primary scale-125' : 'text-muted-foreground'}"
    >
      {letter}
    </span>
  {/each}
</div>
