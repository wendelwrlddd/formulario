import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.getElementById('leads-body');

  fetch('https://valiant-spirit-production.up.railway.app/api/leads')
    .then(res => res.json())
    .then(data => {
      tbody.innerHTML = '';
      if (!Array.isArray(data) || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center">Nenhum formulário recebido ainda.</td></tr>`;
        return;
      }

      data.forEach(lead => {
        const row = document.createElement('tr');
        
        // Format date
        const dateObj = new Date(lead.created_at);
        const formattedDate = dateObj.toLocaleDateString('pt-BR') + ' ' + dateObj.toLocaleTimeString('pt-BR');
        
        row.innerHTML = `
          <td>${lead.name}</td>
          <td>${lead.whatsapp}</td>
          <td>${lead.has_business === 'yes' ? 'Sim' : 'Não'}</td>
          <td>${lead.problem || '-'}</td>
          <td>${lead.url || '-'}</td>
          <td>${formattedDate}</td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch(err => {
      console.error(err);
      tbody.innerHTML = `<tr><td colspan="6" class="text-center" style="color: var(--error-color)">Erro ao buscar dados do servidor. O backend pode estar fora do ar.</td></tr>`;
    });
});
