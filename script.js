document.getElementById('form-consulta').addEventListener('submit', function(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const data = document.getElementById('data').value;
    const hora = document.getElementById('hora').value;
    const procedimento = document.getElementById('procedimento').value;
    const valor = document.getElementById('valor').value;
    const formaPagamento = document.querySelector('input[name="formaPagamento"]:checked').value;
    const parcelas = document.getElementById('parcelas').value || null;
    const detalhes = document.getElementById('detalhes').value;

    const consulta = {
        nome: nome,
        cpf: cpf,
        data: data,
        hora: hora,
        procedimento: procedimento,
        valor: valor,
        formaPagamento: formaPagamento,
        parcelas: formaPagamento === 'Crédito' ? parcelas : null,
        detalhes: detalhes
    };

    if (verificarConflito(consulta)) {
        document.getElementById('mensagemErro').style.display = 'block';
        document.getElementById('mensagemErro').innerText = 'Já existe uma consulta marcada para esse horário!';
    } else {
        document.getElementById('mensagemErro').style.display = 'none';
        salvarConsulta(consulta);
        exibirConsultas();
        document.getElementById('form-consulta').reset();
        document.getElementById('parcelasSection').style.display = 'none';
    }
});

function verificarConflito(novaConsulta) {
    const consultas = localStorage.getItem('consultas') ? JSON.parse(localStorage.getItem('consultas')) : [];
    return consultas.some(consulta => consulta.data === novaConsulta.data && consulta.hora === novaConsulta.hora);
}

function salvarConsulta(consulta) {
    let consultas = localStorage.getItem('consultas') ? JSON.parse(localStorage.getItem('consultas')) : [];
    consultas.push(consulta);
    localStorage.setItem('consultas', JSON.stringify(consultas));
}

function exibirConsultas() {
    const consultasDiv = document.getElementById('consultas');
    consultasDiv.innerHTML = '';

    const consultas = localStorage.getItem('consultas') ? JSON.parse(localStorage.getItem('consultas')) : [];

    consultas.forEach((consulta, index) => {
        const consultaDiv = document.createElement('div');
        consultaDiv.classList.add('consulta');
        consultaDiv.innerHTML = `
            <p><strong>Cliente:</strong> ${consulta.nome}</p>
            <p><strong>CPF:</strong> ${consulta.cpf}</p>
            <p><strong>Data:</strong> ${consulta.data}</p>
            <p><strong>Hora:</strong> ${consulta.hora}</p>
            <p><strong>Procedimento:</strong> ${consulta.procedimento}</p>
            <p><strong>Valor a Cobrar:</strong> R$ ${consulta.valor}</p>
            <p><strong>Forma de Pagamento:</strong> ${consulta.formaPagamento}</p>
            <p><strong>Parcelas:</strong> ${consulta.parcelas ? consulta.parcelas : 'Não se aplica'}</p>
            <p><strong>Detalhes:</strong> ${consulta.detalhes ? consulta.detalhes : 'Nenhum'}</p>
            <button onclick="removerConsulta(${index})">Remover</button>
        `;
        consultasDiv.appendChild(consultaDiv);
    });
}

function removerConsulta(index) {
    let consultas = JSON.parse(localStorage.getItem('consultas'));
    consultas.splice(index, 1);
    localStorage.setItem('consultas', JSON.stringify(consultas));
    exibirConsultas();
}

function filtrarConsultas() {
    const nomeFiltro = document.getElementById('filtroNome').value.toLowerCase();
    const cpfFiltro = document.getElementById('filtroCPF').value;
    const dataFiltro = document.getElementById('filtroData').value;

    const consultas = localStorage.getItem('consultas') ? JSON.parse(localStorage.getItem('consultas')) : [];

    const consultasFiltradas = consultas.filter(consulta => {
        const nomeMatch = consulta.nome.toLowerCase().includes(nomeFiltro);
        const cpfMatch = consulta.cpf.includes(cpfFiltro);
        const dataMatch = dataFiltro ? consulta.data === dataFiltro : true;

        return nomeMatch && cpfMatch && dataMatch;
    });

    const consultasDiv = document.getElementById('consultas');
    consultasDiv.innerHTML = '';

    consultasFiltradas.forEach((consulta, index) => {
        const consultaDiv = document.createElement('div');
        consultaDiv.classList.add('consulta');
        consultaDiv.innerHTML = `
            <p><strong>Cliente:</strong> ${consulta.nome}</p>
            <p><strong>CPF:</strong> ${consulta.cpf}</p>
            <p><strong>Data:</strong> ${consulta.data}</p>
            <p><strong>Hora:</strong> ${consulta.hora}</p>
            <p><strong>Procedimento:</strong> ${consulta.procedimento}</p>
            <p><strong>Valor a Cobrar:</strong> R$ ${consulta.valor}</p>
            <p><strong>Forma de Pagamento:</strong> ${consulta.formaPagamento}</p>
            <p><strong>Parcelas:</strong> ${consulta.parcelas ? consulta.parcelas : 'Não se aplica'}</p>
            <p><strong>Detalhes:</strong> ${consulta.detalhes ? consulta.detalhes : 'Nenhum'}</p>
            <button onclick="removerConsulta(${index})">Remover</button>
        `;
        consultasDiv.appendChild(consultaDiv);
    });
}


document.getElementById('marcarConsultaBtn').addEventListener('click', function() {
    document.getElementById('marcarConsultaSection').style.display = 'block';
    document.getElementById('consultasSection').style.display = 'none';
});

document.getElementById('verConsultasBtn').addEventListener('click', function() {
    document.getElementById('marcarConsultaSection').style.display = 'none';
    document.getElementById('consultasSection').style.display = 'block';
    exibirConsultas();
});


window.onload = exibirConsultas;


document.querySelectorAll('input[name="formaPagamento"]').forEach((radio) => {
    radio.addEventListener('change', function() {
        if (document.getElementById('credito').checked) {
            document.getElementById('parcelasSection').style.display = 'block';
            document.getElementById('parcelas').setAttribute('required', 'required');
        } else {
            document.getElementById('parcelasSection').style.display = 'none';
            document.getElementById('parcelas').removeAttribute('required');
        }
    });
});
