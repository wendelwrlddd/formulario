import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('lead-form');
  const whatsappInput = document.getElementById('whatsapp');
  const radioYes = document.getElementById('business-yes');
  const radioNo = document.getElementById('business-no');
  const conditionalFields = document.getElementById('conditional-fields');
  const formScreen = document.getElementById('form-screen');
  const successScreen = document.getElementById('success-screen');
  const btnBack = document.getElementById('btn-back');
  const nameInput = document.getElementById('name');

  // Remove error states on input
  nameInput.addEventListener('input', () => {
    nameInput.classList.remove('error');
    document.getElementById('name-error').classList.remove('active');
  });

  // WhatsApp Mask (00) 00000-0000
  whatsappInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.substring(0, 11);
    
    if (value.length > 2) {
      value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
    }
    if (value.length > 10) {
      value = `${value.substring(0, 10)}-${value.substring(10)}`;
    }
    
    e.target.value = value;
    
    // Clear error if valid length
    if(value.replace(/\D/g, '').length >= 10) {
      whatsappInput.classList.remove('error');
      document.getElementById('whatsapp-error').classList.remove('active');
    }
  });

  // Conditional Fields Toggle
  const toggleConditionalFields = () => {
    if (radioYes.checked || radioNo.checked) {
      conditionalFields.classList.add('active');
      // Scroll to show fields on mobile
      setTimeout(() => {
        conditionalFields.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 150);
    } else {
      conditionalFields.classList.remove('active');
    }
  };

  radioYes.addEventListener('change', toggleConditionalFields);
  radioNo.addEventListener('change', toggleConditionalFields);

  // Form Submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isValid = true;
    
    if (nameInput.value.trim() === '') {
      nameInput.classList.add('error');
      document.getElementById('name-error').classList.add('active');
      isValid = false;
    }
    
    if (whatsappInput.value.replace(/\D/g, '').length < 10) {
      whatsappInput.classList.add('error');
      document.getElementById('whatsapp-error').classList.add('active');
      isValid = false;
    }

    if (isValid) {
      const btn = form.querySelector('.btn-submit');
      const originalText = btn.innerText;
      btn.innerText = 'Enviando...';
      btn.style.opacity = '0.8';
      btn.style.pointerEvents = 'none';
      
      const payload = {
        name: nameInput.value.trim(),
        whatsapp: whatsappInput.value.trim(),
        has_business: radioYes.checked ? 'yes' : 'no',
        problem: document.getElementById('problem').value.trim() || undefined,
        url: document.getElementById('url').value.trim() || undefined
      };

      // Dispara o evento de Lead no Pixel
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'Lead');
      }

      fetch('https://valiant-spirit-production.up.railway.app/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(res => res.json())
      .then(data => {
        formScreen.style.opacity = '0';
        setTimeout(() => {
          formScreen.style.display = 'none';
          successScreen.classList.add('active');
          form.reset();
          btn.innerText = originalText;
          btn.style.opacity = '1';
          btn.style.pointerEvents = 'auto';
          conditionalFields.classList.remove('active');
        }, 400); // fade out duration
      })
      .catch(err => {
        console.error("Erro ao enviar contato:", err);
        alert("Ocorreu um erro ao enviar seu formulário. Tente novamente mais tarde.");
        btn.innerText = originalText;
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';
      });
    }
  });

  // Back Button
  btnBack.addEventListener('click', () => {
    successScreen.classList.remove('active');
    formScreen.style.display = 'block';
    // Small delay to allow display block to apply before opacity transition
    setTimeout(() => {
      formScreen.style.opacity = '1';
    }, 50);
  });
});
