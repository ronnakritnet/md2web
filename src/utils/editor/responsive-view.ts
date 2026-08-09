export interface ResponsiveViewElements {
  editorPane: HTMLElement;
  previewPane: HTMLElement;
  viewEditBtn: HTMLElement;
  viewPreviewBtn: HTMLElement;
  formattingTools: HTMLElement;
  colorSwatchesContainer: HTMLElement;
}

export interface ResponsiveViewOptions {
  updatePreview: () => Promise<void>;
}

export function setMobileView(
  elements: ResponsiveViewElements,
  view: 'edit' | 'preview',
  options: ResponsiveViewOptions
): void {
  const { editorPane, previewPane, viewEditBtn, viewPreviewBtn, formattingTools, colorSwatchesContainer } = elements;
  const { updatePreview } = options;

  if (!editorPane || !previewPane || !viewEditBtn || !viewPreviewBtn || !formattingTools || !colorSwatchesContainer) {
    console.warn('setMobileView: Missing required elements');
    return;
  }

  if (view === 'edit') {
    // Editor pane: show with flex
    editorPane.classList.remove('hidden');
    editorPane.classList.add('flex');
    // Preview pane: hide
    previewPane.classList.add('hidden');
    previewPane.classList.remove('flex');
    // Show formatting tools in edit mode
    formattingTools.classList.remove('hidden');
    // Hide color swatches in edit mode
    colorSwatchesContainer.classList.add('hidden');
    // Update button states for segmented control
    viewEditBtn.classList.remove('bg-transparent', 'text-gray-400', 'hover:text-gray-200', 'border-transparent');
    viewEditBtn.classList.add('bg-emerald-950/60', 'text-emerald-400', 'border', 'border-emerald-500/30', 'shadow-sm', 'pointer-events-none');
    viewPreviewBtn.classList.remove('bg-emerald-950/60', 'text-emerald-400', 'border', 'border-emerald-500/30', 'shadow-sm', 'pointer-events-none');
    viewPreviewBtn.classList.add('bg-transparent', 'text-gray-400', 'hover:text-gray-200', 'border-transparent');
  } else {
    // Editor pane: hide
    editorPane.classList.add('hidden');
    editorPane.classList.remove('flex');
    // Preview pane: show with flex
    previewPane.classList.remove('hidden');
    previewPane.classList.add('flex');
    // Hide formatting tools in preview mode
    formattingTools.classList.add('hidden');
    // Show color swatches in preview mode for theme testing
    colorSwatchesContainer.classList.remove('hidden');
    // Update button states for segmented control
    viewPreviewBtn.classList.remove('bg-transparent', 'text-gray-400', 'hover:text-gray-200', 'border-transparent');
    viewPreviewBtn.classList.add('bg-emerald-950/60', 'text-emerald-400', 'border', 'border-emerald-500/30', 'shadow-sm', 'pointer-events-none');
    viewEditBtn.classList.remove('bg-emerald-950/60', 'text-emerald-400', 'border', 'border-emerald-500/30', 'shadow-sm', 'pointer-events-none');
    viewEditBtn.classList.add('bg-transparent', 'text-gray-400', 'hover:text-gray-200', 'border-transparent');
    // Update preview when switching to preview view
    updatePreview();
  }
}

export function handleResponsiveView(
  e: MediaQueryListEvent | MediaQueryList,
  elements: ResponsiveViewElements,
  options: ResponsiveViewOptions
): void {
  const { editorPane, previewPane, formattingTools, colorSwatchesContainer } = elements;
  const isDesktop = e.matches;

  if (!editorPane || !previewPane || !formattingTools || !colorSwatchesContainer) {
    console.warn('handleResponsiveView: Missing required elements');
    return;
  }

  if (isDesktop) {
    // Desktop: show both panes side-by-side
    editorPane.classList.remove('hidden');
    editorPane.classList.add('flex');
    previewPane.classList.remove('hidden');
    previewPane.classList.add('flex');
    // Show both formatting tools and color swatches on desktop
    formattingTools.classList.remove('hidden');
    colorSwatchesContainer.classList.remove('hidden');
  } else {
    // Mobile: default to edit mode (single pane)
    setMobileView(elements, 'edit', options);
  }
}

export function setupResponsiveView(
  elements: ResponsiveViewElements,
  options: ResponsiveViewOptions
): () => void {
  const mediaQuery = window.matchMedia('(min-width: 768px)');
  
  const handler = (e: MediaQueryListEvent) => {
    handleResponsiveView(e, elements, options);
  };

  mediaQuery.addEventListener('change', handler);
  
  // Initial view setup
  handleResponsiveView(mediaQuery, elements, options);

  // Return cleanup function
  return () => {
    mediaQuery.removeEventListener('change', handler);
  };
}
