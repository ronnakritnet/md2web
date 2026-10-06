export function setupInternalLinkHandler(containerElement: HTMLElement | null): () => void {
  if (!containerElement) {
    return () => {};
  }

  const handler = (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    // Handle code block copy button
    const copyBtn = target.closest('.copy-code-btn') as HTMLButtonElement | null;
    if (copyBtn) {
      e.preventDefault();
      e.stopPropagation();
      const rawCode = copyBtn.getAttribute('data-code');
      const codeToCopy = rawCode ? decodeURIComponent(rawCode) : '';
      if (codeToCopy && typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(codeToCopy).then(() => {
          const label = copyBtn.querySelector('.copy-label');
          if (label) {
            const originalText = label.textContent;
            label.textContent = 'Copied!';
            copyBtn.classList.add('text-emerald-400');
            setTimeout(() => {
              label.textContent = originalText;
              copyBtn.classList.remove('text-emerald-400');
            }, 2000);
          }
        }).catch((err) => {
          console.error('Failed to copy code:', err);
        });
      }
      return;
    }

    const link = target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      const targetId = href.substring(1);
      
      // Try multiple strategies to find the target element
      const targetEl = 
        containerElement.querySelector(`#${CSS.escape(targetId)}`) ||
        document.getElementById(targetId) ||
        containerElement.querySelector(`[id*="${CSS.escape(targetId)}"]`) ||
        document.querySelector(`[id*="${CSS.escape(targetId)}"]`);

      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        console.warn('Scroll target not found:', targetId);
      }
    }
  };

  containerElement.addEventListener('click', handler, { capture: true });

  // Return cleanup function
  return () => {
    containerElement.removeEventListener('click', handler, { capture: true } as unknown as boolean);
  };
}
