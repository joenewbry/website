(() => {
  'use strict';
  const question = document.getElementById('question');
  const preview = document.getElementById('prompt-preview');
  const open = document.getElementById('open-codex');
  const copy = document.getElementById('copy-prompt');
  const status = document.getElementById('prompt-status');
  const details = document.getElementById('prompt-details');
  let template = '';
  function update() {
    if (!template) return;
    const value = question.value.trim() || question.defaultValue;
    preview.value = template + '\nMy question: ' + value;
    open.href = 'codex://new?prompt=' + encodeURIComponent(preview.value);
    status.textContent = '';
  }
  question.addEventListener('input', update);
  document.querySelectorAll('[data-question]').forEach(button => {
    button.addEventListener('click', () => {
      question.value = button.dataset.question;
      update();
      question.focus();
    });
  });
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(preview.value);
      status.textContent = 'Prompt copied. Paste it into a new Codex conversation.';
    } catch {
      details.open = true;
      preview.focus();
      preview.select();
      status.textContent = 'Copy was blocked. The prompt is selected below; copy it manually.';
    }
  });
  open.addEventListener('click', () => {
    status.textContent = 'If Codex doesn’t open, use Copy prompt and paste it into your agent.';
  });
  fetch('/ask/prompt.txt', { cache: 'no-cache' })
    .then(response => {
      if (!response.ok) throw new Error('Prompt unavailable');
      return response.text();
    })
    .then(text => {
      const marker = '\nMy question: ';
      if (!text.startsWith("Help me learn about Joe Newbry") || !text.includes(marker)) {
        throw new Error('Unexpected prompt response');
      }
      template = text.slice(0, text.lastIndexOf(marker)).trimEnd();
      update();
      open.hidden = false;
      copy.hidden = false;
    })
    .catch(() => {
      preview.value = 'The prompt could not be loaded. Use the plain-text prompt link below or read the public work record.';
      status.textContent = 'The prompt could not be loaded. Use the plain-text link below, or reload to try again.';
    });
})();
