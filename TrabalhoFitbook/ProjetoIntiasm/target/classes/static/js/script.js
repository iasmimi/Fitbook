const API_URL = "http://localhost:8080/api"; // Substitua pela URL do seu backend
const IMAGE_UPLOAD_URL = "http://localhost:8080/api/image/upload"; // Substitua pela URL do upload de imagem

document.addEventListener("DOMContentLoaded", () => {
    listarRegistros(); // Carrega os registros ao iniciar

    const form = document.querySelector('#formRegistro'); // Seleciona o formulário de cadastro
    form.addEventListener("submit", adicionarRegistro);

    const imageInput = document.getElementById("fileRegistro"); // Atualizado para o ID correto
    imageInput.addEventListener("change", previewImage);

    const cadastrarBtn = document.querySelector('.cadastrar-btn');
    cadastrarBtn.addEventListener('click', abrirModalCadastro);

    const closeBtn = document.querySelector('.close');
    closeBtn.addEventListener('click', fecharModal);
});

// Função para abrir o modal de cadastro
function abrirModalCadastro() {
    document.getElementById('formContainer').style.display = "block";
    document.querySelector('.modal-titulo').innerText = "Cadastrar Registro"; // Atualizado para usar a classe
    document.querySelector('#formRegistro').reset(); // Reseta o formulário
    document.querySelector('.registroId').value = ''; // Limpa o ID do registro
    document.getElementById('imagePreviewRegistro').style.display = 'none'; // Esconde a imagem de pré-visualização
}

// Função para fechar o modal
function fecharModal() {
    document.getElementById('formContainer').style.display = "none"; // Fecha o formulário
}

// Função para pré-visualizar a imagem
function previewImage(event) {
    const imagePreview = document.getElementById('imagePreviewRegistro'); // Certifique-se de que o ID está correto
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result; // Define a fonte da imagem de pré-visualização
            imagePreview.style.display = 'block'; // Exibe a imagem
        };
        reader.readAsDataURL(file); // Lê o arquivo como URL de dados
    } else {
        imagePreview.style.display = 'none'; // Esconde a imagem se nenhum arquivo for selecionado
    }
}

// Função para listar todos os registros
async function listarRegistros() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Erro ao carregar os registros.");

        const registros = await response.json();
        const tabelaBody = document.querySelector('#tabelaRegistros tbody');
        tabelaBody.innerHTML = ''; // Limpa o corpo da tabela antes de adicionar novos registros

        registros.forEach(registro => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${registro.titulo}</td>
                <td>${registro.ocasiao}</td>
                <td>${registro.descricao}</td>
                <td><img src="${registro.imageURL || 'placeholder.png'}" alt="Imagem do Registro" style="max-width: 50px; max-height: 50px;"></td>
                <td>
                    <button class="editar" onclick="editarRegistro(${registro.id})">Editar</button>
                    <button class="deletar" onclick="deletarRegistro(${registro.id})">Deletar</button>
                </td>
            `;
            tabelaBody.appendChild(row);
        });
    } catch (error) {
        console.error("Erro ao listar registros:", error);
        alert(error.message);
    }
}

// Função para adicionar ou editar um registro
async function adicionarRegistro(event) {
    event.preventDefault(); // Previne o comportamento padrão do formulário
    const formData = new FormData(document.querySelector('#formRegistro')); // Atualizado para usar o ID correto

    const registroId = formData.get('registroId'); // Obtém o ID do registro se estiver editando
    const novoRegistro = {
        titulo: formData.get('titulo'),
        ocasiao: formData.get('ocasiao'),
        descricao: formData.get('descricao'),
    };

    try {
        let response;
        if (registroId) {
            // Se registroId existir, estamos editando
            response = await fetch(`${API_URL}/${registroId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(novoRegistro),
            });
        } else {
            // Se não, estamos adicionando um novo registro
            response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(novoRegistro),
            });
        }

        if (!response.ok) throw new Error("Erro ao adicionar ou editar registro.");

        const registro = await response.json();
        const fileInput = document.getElementById('fileRegistro'); // Atualizado para o ID correto
        if (fileInput.files.length > 0) {
            await uploadImage(registro.id, fileInput.files[0]);
        }
        listarRegistros(); // Atualiza a lista de registros
        alert(registroId ? "Registro editado com sucesso." : "Registro adicionado com sucesso.");
        fecharModal(); // Fecha o modal
    } catch (error) {
        console.error("Erro:", error);
        alert(error.message);
    }
}

// Função para fazer o upload da imagem
async function uploadImage(id, file) { // Corrigido o nome da função
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${IMAGE_UPLOAD_URL}/${id}`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) throw new Error("Erro ao fazer upload da imagem.");
    } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error);
        alert(error.message);
    }
}

// Função para editar um registro
async function editarRegistro(id) {
    const registro = await fetch(`${API_URL}/${id}`).then(res => res.json());
    document.getElementById('tituloRegistro').value = registro.titulo; // Atualizado para o ID correto
    document.getElementById('ocasiaoRegistro').value = registro.ocasiao; // Atualizado para o ID correto
    document.getElementById('descricaoRegistro').value = registro.descricao; // Atualizado para o ID correto
    document.querySelector('.registroId').value = registro.id; // Atualizado para usar a classe
    document.querySelector('.modal-titulo').innerText = "Editar Registro"; // Atualizado para usar a classe
    document.getElementById('formContainer').style.display = "block"; // Abre o formulário
}

// Função para deletar um registro
async function deletarRegistro(id) {
    if (confirm("Tem certeza que deseja deletar este registro?")) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error("Erro ao deletar registro.");
            alert("Registro deletado com sucesso.");
            listarRegistros(); // Atualiza a lista de registros
        } catch (error) {
            console.error("Erro:", error);
            alert(error.message);
        }
    }
}