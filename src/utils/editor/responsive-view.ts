export interface ResponsiveViewElements {
  editorPane: HTMLElement;
  previewPane: HTMLElement;
  viewEditBtn: HTMLElement;
  viewPreviewBtn: HTMLElement;
  toolbar: HTMLElement;
}

export interface ResponsiveViewOptions {
  updatePreview: () => Promise<void>;
}

export function setMobileView(
  elements: ResponsiveViewElements,
  view: 'edit' | 'preview',
  options: ResponsiveViewOptions
): void {
  const { editorPane, previewPane, viewEditBtn, viewPreviewBtn, toolbar } = elements;
  const { updatePreview } = options;

  if (!editorPane || !previewPane || !viewEditBtn || !viewPreviewBtn || !toolbar) {
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
    // Show toolbar in edit mode
    toolbar.classList.remove('hidden');
    // Update button states
    viewEditBtn.classList.remove('bg-slate-700', 'text-slate-300', 'hover:bg-slate-600');
    viewEditBtn.classList.add('bg-green-600', 'text-white');
    viewPreviewBtn.classList.remove('bg-green-600', 'text-white');
    viewPreviewBtn.classList.add('bg-slate-700', 'text-slate-300', 'hover:bg-slate-600');
  } else {
    // Editor pane: hide
    editorPane.classList.add('hidden');
    editorPane.classList.remove('flex');
    // Preview pane: show with flex
    previewPane.classList.remove('hidden');
    previewPane.classList.add('flex');
    // Hide toolbar in preview mode for mobile
    toolbar.classList.add('hidden');
    // Update button states
    viewPreviewBtn.classList.remove('bg-slate-700', 'text-slate-300', 'hover:bg-slate-600');
    viewPreviewBtn.classList.add('bg-green-600', 'text-white');
    viewEditBtn.classList.remove('bg-green-600', 'text-white');
    viewEditBtn.classList.add('bg-slate-700', 'text-slate-300', 'hover:bg-slate-600');
    // Update preview when switching to preview view
    updatePreview();
  }
}

export function handleResponsiveView(
  e: MediaQueryListEvent | MediaQueryList,
  elements: ResponsiveViewElements,
  options: ResponsiveViewOptions
): void {
  const { editorPane, previewPane, toolbar } = elements;
  const isDesktop = e.matches;

  if (!editorPane || !previewPane || !toolbar) {
    console.warn('handleResponsiveView: Missing required elements');
    return;
  }

  if (isDesktop) {
    // Desktop: show both panes side-by-side
    editorPane.classList.remove('hidden');
    editorPane.classList.add('flex');
    previewPane.classList.remove('hidden');
    previewPane.classList.add('flex');
    // Show toolbar on desktop
    toolbar.classList.remove('hidden');
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
