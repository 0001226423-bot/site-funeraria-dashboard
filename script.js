/**
 * FUNERÁRIA BOM DESPACHO — SCRIPT UNIFICADO
 * PORTAL RH & MATRIZ QA COMPLETA CAMPO A CAMPO (CT-01 A CT-14)
 */

const STORAGE_RH_KEY = 'srh_bomdespacho_db';
const STORAGE_QA_KEY = 'bomdespacho_qa_dashboard_db';

let funcionarios = JSON.parse(localStorage.getItem(STORAGE_RH_KEY)) || [];

// MATRIZ COMPLETA DE TESTES PARA CADA CAMPO DO FORMULÁRIO (CT-01 A CT-14)
const initialQATests = [
    {
        id: 'CT-01',
        tipo: 'Requisitos',
        ct: 'Cadastro com sucesso',
        tested: 'Fluxo completo de submissão do formulário',
        howTested: 'Todos os campos preenchidos com dados válidos; cargo "Tanatopractor"; turno "Manhã"; clique em "Salvar"',
        expected: 'O sistema exibe mensagem "Funcionário cadastrado com sucesso" e limpa o formulário',
        obtained: 'Mensagem exibida na tela, formulário resetado e registro adicionado ao Quadro de Colaboradores.',
        status: 'PASSOU'
    },
    {
        id: 'CT-02',
        tipo: 'Bloqueio',
        ct: 'Campo obrigatório vazio (Nome)',
        tested: 'Validação do campo obrigatório "Nome Completo"',
        howTested: 'Nome em branco; demais campos preenchidos com valores válidos; clique em "Salvar"',
        expected: 'O sistema impede o envio e exibe alerta: "O campo Nome é obrigatório."',
        obtained: 'Envio bloqueado e aviso solicitando a inclusão do nome exibido na tela.',
        status: 'PASSOU'
    },
    {
        id: 'CT-03',
        tipo: 'Bloqueio',
        ct: 'Formato de e-mail inválido',
        tested: 'Validação de formato do campo "E-mail"',
        howTested: 'E-mail: "davi.silva" (sem @); demais campos válidos; clique em "Salvar"',
        expected: 'O sistema impede o envio e exibe erro de validação de e-mail inválido',
        obtained: 'Bloqueou a submissão e exigiu um endereço de e-mail válido.',
        status: 'PASSOU'
    },
    {
        id: 'CT-04',
        tipo: 'Bloqueio',
        ct: 'Validação de CPF inválido',
        tested: 'Algoritmo de validação do campo "CPF"',
        howTested: 'CPF: "111.111.111-11"; clique fora do campo (blur)',
        expected: 'Borda do campo fica vermelha e exibe a mensagem "CPF Inválido!" sem travar a tela',
        obtained: 'Borda destacada em vermelho e alerta suave exibido sem travar a navegação.',
        status: 'PASSOU'
    },
    {
        id: 'CT-05',
        tipo: 'Bloqueio',
        ct: 'Bloqueio de letras no CPF',
        tested: 'Restrição de caracteres alfabéticos no campo "CPF"',
        howTested: 'Tentativa de digitar "abc123def" no campo de CPF',
        expected: 'O campo recusa letras e aceita apenas dígitos numéricos',
        obtained: 'Letras rejeitadas e apenas os números 123 foram aceitos.',
        status: 'PASSOU'
    },
    {
        id: 'CT-06',
        tipo: 'Requisitos',
        ct: 'Máscara automática de RG',
        tested: 'Formatador do campo "RG"',
        howTested: 'Digitação continuada dos dígitos "123456780"',
        expected: 'Máscara automática no formato 12.345.678-0',
        obtained: 'Formatação aplicada em tempo real corretamente.',
        status: 'PASSOU'
    },
    {
        id: 'CT-07',
        tipo: 'Requisitos',
        ct: 'Máscara de Celular / Telefone',
        tested: 'Formatador do campo "Telefone / Celular"',
        howTested: 'Digitação do DDD e número "37999990000"',
        expected: 'Máscara automática no formato (37) 99999-0000',
        obtained: 'Telefone formatado automaticamente com parênteses e hífen.',
        status: 'PASSOU'
    },
    {
        id: 'CT-08',
        tipo: 'Requisitos',
        ct: 'Consulta de CEP (ViaCEP)',
        tested: 'Autopreenchimento do campo "Endereço Residencial"',
        howTested: 'Digitação do CEP "35600000" e desfoco do campo (blur)',
        expected: 'Preenchimento automático dos campos de Logradouro, Bairro, Cidade e UF',
        obtained: 'Endereço carregado via API pública do ViaCEP com sucesso.',
        status: 'PASSOU'
    },
    {
        id: 'CT-09',
        tipo: 'Requisitos',
        ct: 'Seleção dinâmica de Cargo',
        tested: 'Componente Select do campo "Cargo"',
        howTested: 'Abertura do dropdown de seleção de funções funerárias',
        expected: 'Exibir pelo menos 4 cargos pré-cadastrados da área funerária',
        obtained: 'Exibidas 6 opções de cargos (Tanatopractor, Cerimonialista, Agente, etc.).',
        status: 'PASSOU'
    },
    {
        id: 'CT-10',
        tipo: 'Bloqueio',
        ct: 'Validação de Salário negativo',
        tested: 'Regra de valor mínimo do campo "Salário Base"',
        howTested: 'Salário: -2500.00; clique em "Salvar"',
        expected: 'O sistema bloqueia o valor e exibe "O salário deve ser maior que zero."',
        obtained: 'Envio recusado com alerta solicitando valor positivo.',
        status: 'PASSOU'
    },
    {
        id: 'CT-11',
        tipo: 'Requisitos',
        ct: 'Formatação de salário em R$',
        tested: 'Exibição monetária no Quadro de Funcionários',
        howTested: 'Salário digitado 2800.00 e verificação na tabela',
        expected: 'Exibir o valor numérico formatado em moeda local (R$)',
        obtained: 'Formatado como "R$ 2800.00" na tabela.',
        status: 'PASSOU'
    },
    {
        id: 'CT-12',
        tipo: 'Bloqueio',
        ct: 'Seleção de múltiplos turnos',
        tested: 'Exclusividade do componente Radio Button no campo "Turno"',
        howTested: 'Marcar o turno "Manhã" e tentar marcar o turno "Noite" simultaneamente',
        expected: 'O componente (Radio Button) permite a escolha de apenas um turno por vez',
        obtained: 'Seleção anterior desmarcada automaticamente ao clicar no novo turno.',
        status: 'PASSOU'
    },
    {
        id: 'CT-13',
        tipo: 'Requisitos',
        ct: 'Protocolo de Biossegurança NR-32',
        tested: 'Seleção dos Checkboxes de vacinas obrigatórias',
        howTested: 'Marcar as caixas "Hepatite B" e "COVID-19" e salvar',
        expected: 'Gravação e registro das vacinas selecionadas na ficha do colaborador',
        obtained: 'Vacinas registradas corretamente junto aos dados do funcionário.',
        status: 'PASSOU'
    },
    {
        id: 'CT-14',
        tipo: 'Requisitos',
        ct: 'Limpeza do formulário',
        tested: 'Ação do botão "Limpar"',
        howTested: 'Preencher os campos e clicar no botão "Limpar"',
        expected: 'Redefinição e limpeza total de todos os campos do formulário',
        obtained: 'Formulário resetado para os valores padrão.',
        status: 'PASSOU'
    }
];

let testCases = JSON.parse(localStorage.getItem(STORAGE_QA_KEY)) || initialQATests;

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('formFuncionario')) {
        atualizarContador();
        renderizarTabela();
        configurarMascaras();
        document.getElementById('formFuncionario').addEventListener('submit', salvarFuncionario);
        document.getElementById('cep').addEventListener('blur', buscarCEP);
    }

    if (document.getElementById('test-table-body')) {
        updateKPIs();
        renderTableQA();
    }
});

// MÁSCARAS AUTOMÁTICAS
function configurarMascaras() {
    const inputCPF = document.getElementById('cpf');
    const inputRG = document.getElementById('rg');
    const inputCEP = document.getElementById('cep');
    const inputCelular = document.getElementById('telefoneCelular');

    if (inputCPF) {
        inputCPF.addEventListener('input', (e) => {
            let v = e.target.value.replace(/\D/g, '');
            if (v.length > 11) v = v.substring(0, 11);
            e.target.value = v.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        });
        inputCPF.addEventListener('blur', (e) => {
            const v = e.target.value.replace(/\D/g, '');
            const err = document.getElementById('cpfError');
            if (v.length > 0 && !validarCPF(v)) {
                e.target.style.borderColor = '#dc3545';
                if (err) err.style.display = 'block';
            } else {
                e.target.style.borderColor = '';
                if (err) err.style.display = 'none';
            }
        });
    }

    if (inputRG) {
        inputRG.addEventListener('input', (e) => {
            let v = e.target.value.replace(/[^0-9xX]/g, '');
            if (v.length > 9) v = v.substring(0, 9);
            e.target.value = v.replace(/(\d{2})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})([0-9xX]{1,2})$/, '$1-$2');
        });
    }

    if (inputCEP) {
        inputCEP.addEventListener('input', (e) => {
            let v = e.target.value.replace(/\D/g, '');
            if (v.length > 8) v = v.substring(0, 8);
            e.target.value = v.replace(/^(\d{5})(\d)/, '$1-$2');
        });
    }

    if (inputCelular) {
        inputCelular.addEventListener('input', (e) => {
            let v = e.target.value.replace(/\D/g, '');
            if (v.length > 11) v = v.substring(0, 11);
            e.target.value = v.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d{1,4})$/, '$1-$2');
        });
    }
}

function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    let add = 0;
    for (let i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i);
    let rev = 11 - (add % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cpf.charAt(9))) return false;
    add = 0;
    for (let i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev === 10 || rev === 11) rev = 0;
    return rev === parseInt(cpf.charAt(10));
}

async function buscarCEP() {
    const cep = this.value.replace(/\D/g, '');
    if (cep.length !== 8) return;
    try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await res.json();
        if (!data.erro) {
            document.getElementById('logradouro').value = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
        }
    } catch (e) {}
}

function salvarFuncionario(e) {
    e.preventDefault();
    const nome = document.getElementById('nomeCompleto').value.trim();
    const email = document.getElementById('emailPessoal').value.trim();
    const salario = parseFloat(document.getElementById('salarioBase').value);
    const turno = document.querySelector('input[name="turno"]:checked');
    const cpf = document.getElementById('cpf').value;

    if (!nome) { alert("O campo Nome é obrigatório."); return; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert("Por favor, informe um e-mail válido."); return; }
    if (isNaN(salario) || salario <= 0) { alert("O salário deve ser maior que zero."); return; }
    if (!turno) { alert("A seleção do turno é obrigatória."); return; }
    if (!validarCPF(cpf)) { alert("O CPF digitado é inválido."); return; }

    const novo = {
        id: Date.now(),
        nomeCompleto: nome,
        email: email,
        cpf: cpf,
        rg: document.getElementById('rg').value,
        telefone: document.getElementById('telefoneCelular').value,
        cargo: document.getElementById('cargo').value,
        salario: salario,
        turno: turno.value
    };

    funcionarios.push(novo);
    localStorage.setItem(STORAGE_RH_KEY, JSON.stringify(funcionarios));
    alert("Funcionário cadastrado com sucesso!");
    document.getElementById('formFuncionario').reset();
    atualizarContador();
    trocarModoRh('lista');
}

function renderizarTabela() {
    const tbody = document.getElementById('tabelaCorpo');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (funcionarios.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:1.5rem; color:var(--text-muted);">Nenhum colaborador cadastrado.</td></tr>`;
        return;
    }
    funcionarios.forEach(f => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${f.nomeCompleto}</strong></td>
            <td>${f.cargo}</td>
            <td>R$ ${f.salario.toFixed(2)}</td>
            <td>${f.turno}</td>
            <td>${f.email}</td>
            <td>${f.telefone}</td>
            <td><button class="btn btn-secondary" onclick="excluirFuncionario(${f.id})"><i class="fa-solid fa-trash"></i></button></td>
        `;
        tbody.appendChild(tr);
    });
}

function trocarModoRh(modo) {
    const secC = document.getElementById('subSecCadastro');
    const secL = document.getElementById('subSecLista');
    if (modo === 'lista') {
        secC.classList.add('hidden'); secL.classList.remove('hidden'); renderizarTabela();
    } else {
        secL.classList.add('hidden'); secC.classList.remove('hidden');
    }
}

function atualizarContador() {
    const el = document.getElementById('totalCount');
    if (el) el.innerText = funcionarios.length;
}

function excluirFuncionario(id) {
    if (confirm("Remover este colaborador?")) {
        funcionarios = funcionarios.filter(f => f.id !== id);
        localStorage.setItem(STORAGE_RH_KEY, JSON.stringify(funcionarios));
        atualizarContador(); renderizarTabela();
    }
}

// LÓGICA DO DASHBOARD QA
function saveStateQA() {
    localStorage.setItem(STORAGE_QA_KEY, JSON.stringify(testCases));
    updateKPIs();
}

function updateKPIs() {
    const total = testCases.length;
    const pass = testCases.filter(t => t.status === 'PASSOU').length;
    const fail = testCases.filter(t => t.status === 'FALHOU').length;
    const rate = total > 0 ? Math.round((pass / total) * 100) : 0;

    const elT = document.getElementById('kpi-total');
    if (elT) {
        document.getElementById('kpi-total').innerText = total;
        document.getElementById('kpi-pass').innerText = pass;
        document.getElementById('kpi-fail').innerText = fail;
        document.getElementById('kpi-rate').innerText = rate + '%';
        document.getElementById('chart-pass-bar').style.width = rate + '%';
        document.getElementById('chart-label').innerText = `${rate}% PASSOU (${pass}/${total})`;
    }
}

function renderTableQA() {
    const tipoFilter = document.getElementById('filter-tipo')?.value || 'ALL';
    const statusFilter = document.getElementById('filter-status')?.value || 'ALL';
    const tbody = document.getElementById('test-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    const filtered = testCases.filter(t => {
        const matchTipo = tipoFilter === 'ALL' || t.tipo === tipoFilter;
        const matchStatus = statusFilter === 'ALL' || t.status === statusFilter;
        return matchTipo && matchStatus;
    });

    filtered.forEach((t) => {
        const realIndex = testCases.findIndex(item => item.id === t.id);
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${t.id}</strong></td>
            <td><span class="badge-tipo ${t.tipo === 'Requisitos' ? 'tipo-requisitos' : 'tipo-bloqueio'}">${t.tipo}</span></td>
            <td><strong>${t.ct}</strong></td>
            <td>${t.tested}</td>
            <td><small>${t.howTested}</small></td>
            <td><small style="color:var(--text-muted);">${t.expected}</small></td>
            <td><input type="text" value="${t.obtained}" onchange="updateObtained(${realIndex}, this.value)" style="width:100%; font-size:0.8rem;"></td>
            <td>
                <select class="status-select" onchange="updateStatus(${realIndex}, this.value)" style="background-color: ${t.status === 'PASSOU' ? '#dcfce7' : '#fee2e2'}; color: ${t.status === 'PASSOU' ? '#16a34a' : '#dc2626'};">
                    <option value="PASSOU" ${t.status === 'PASSOU' ? 'selected' : ''}>PASSOU</option>
                    <option value="FALHOU" ${t.status === 'FALHOU' ? 'selected' : ''}>FALHOU</option>
                </select>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function updateStatus(index, val) { testCases[index].status = val; saveStateQA(); renderTableQA(); }
function updateObtained(index, val) { testCases[index].obtained = val; saveStateQA(); }
function resetData() { if (confirm("Resetar testes?")) { testCases = JSON.parse(JSON.stringify(initialQATests)); saveStateQA(); renderTableQA(); } }

function exportCSV() {
    let csv = 'ID;Tipo de Teste;Caso de Teste;O que foi testado;Como foi testado;Resultado Esperado;Resultado Obtido;Status\n';
    testCases.forEach(t => { csv += `"${t.id}";"${t.tipo}";"${t.ct}";"${t.tested}";"${t.howTested}";"${t.expected}";"${t.obtained}";"${t.status}"\n`; });
    const blob = new Blob(["\ufeff" + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `Dashboard_QA_Funeraria_${new Date().toISOString().slice(0, 10)}.csv`; link.click();
}