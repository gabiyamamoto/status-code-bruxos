import { error } from "console";
import dados from "./../models/dados.js"
const { bruxos } = dados;

const getAllBruxos = (req, res) => {
    const { casa } = req.query;
    let resultado = bruxos;

    if (casa) {
        resultado = resultado.filter(b => b.casa.toLowerCase().includes(casa.toLowerCase()));
    }

    res.status(200).json({
        status: 200,
        success: true,
        message: "Lista de bruxos convocada com sucesso!",
        total: resultado.length,
        data: resultado
    });
};

const getBruxoById = (req, res) => {

    const id = parseInt(req.params.id);
    const bruxo = bruxos.find(b => b.id === id);

    if (!bruxo) {
        return res.status(404).json({
            status: 404,
            success: false,
            message: `Nenhum bruxo com o id ${id} foi encontrado no Beco Diagonal!`,
            error: "WIZARD_NOT_FOUND",
            suggestions: [
                "Cheque a escrita do nome do bruxo",
                "Verifique se o bruxo está registrado"
            ]
        });
    }

    res.status(200).json({
        status: 200,
        success: true,
        message: "Bruxo convocado com sucesso!",
        total: bruxo.length,
        data: bruxo
    });
};

const createBruxo = (req, res) => {
    const { nome, casa, anoNascimento, especialidade, nivelMagia, ativo, varinha } = req.body;
    const nomeJaExiste = bruxos.find(b => b.nome.toLowerCase() === nome.toLowerCase());
    const casasOficiais = ["Gryffindor", "Slytherin", "Hufflepuff", "Ravenclaw"];

    // Validações
    if (!nome) {
        return res.status(400).json({
            status: 400,
            success: false,
            message: "Feitiço mal executado! Verifique os ingredientes",
            error: "VALIDATION_ERROR",
            details: "O campo de nome é necessário",
        });
    }

    if (!casasOficiais.includes(casa)) {
        return res.status(400).json({
            status: 400,
            success: false,
            message: `A casa "${casa}" não é válida. Casas permitidas: ${casasOficiais.join(", ")}.`
        });
    }

    if (varinha && varinha.length < 3) {
        return res.status(404).json({
            status: 404,
            success: false,
            message: "Varinha precisa ter mais de 3 caracteres!",
            error: "VALIDATION_ERROR"
        });
    }

    const novoBruxo = {
        id: bruxos.length + 1,
        nome,
        casa,
        anoNascimento: parseInt(anoNascimento),
        especialidade: especialidade || "Em desenvolvimento",
        nivelMagia,
        ativo,
    }

    bruxos.push(novoBruxo);

    if (nomeJaExiste) {
        return res.status(409).json({
            status: 409,
            success: false,
            message: "Já existe um bruxo com esse nome!",
            error: "DUPLICATE_WIZARD",
        });
    }

    res.status(201).json({
        status: 201,
        success: true,
        message: "Novo bruxo matriculado em Hogwarts!",
        data: novoBruxo
    });
}

const updateBruxo = (req, res) => {
    const { id } = req.params;
    const { nome, casa, anoNascimento, especialidade, nivelMagia, ativo, varinha } = req.body;
    const casasOficiais = ["Gryffindor", "Slytherin", "Hufflepuff", "Ravenclaw"];

        if (!nome) {
        return res.status(400).json({
            status: 400,
            success: false,
            message: "Feitiço mal executado! Verifique os ingredientes",
            error: "VALIDATION_ERROR",
            details: "O campo de nome é necessário",
        });
    }

    if (!casasOficiais.includes(casa)) {
        return res.status(400).json({
            status: 400,
            success: false,
            message: `A casa "${casa}" não é válida. Casas permitidas: ${casasOficiais.join(", ")}.`
        });
    }

    if (varinha && varinha.length < 3) {
        return res.status(404).json({
            status: 404,
            success: false,
            message: "Varinha precisa ter mais de 3 caracteres!",
            error: "VALIDATION_ERROR"
        });
    }

    if (isNaN(id)) {
        return res.status(400).json({
            status: 400,
            success: false,
            message: "ID deve ser um número válido!",
            error: "VALIDATION_ERROR"
        });
    }

    const idParaEditar = parseInt(id);

    const bruxoExiste = bruxos.find(b => b.id === idParaEditar);
    if (!bruxoExiste) {
        return res.status(404).json({
            status: 404,
            success: false,
            message: "Não é possível reparar o que não existe!",
            error: "WIZARD_NOT_FOUND"
        });
    }

    const bruxosAtualizados = bruxos.map(bruxo =>
        bruxo.id === idParaEditar
            ? {
                ...bruxo,
                ...(nome && { nome }),
                ...(casa && { casa }),
                ...(anoNascimento && { anoNascimento: parseInt(anoNascimento) }),
                ...(especialidade && { especialidade }),
                ...(nivelMagia && { nivelMagia }),
                ...(ativo !== undefined && { ativo })
            }
            : bruxo
    );

    bruxos.splice(0, bruxos.length, ...bruxosAtualizados);

    const bruxoAtualizado = bruxos.find(b => b.id === idParaEditar);

    res.status(200).json({
        status: 200,
        success: true,
        message: `Bruxo com id ${id} atualizado com sucesso!`,
        data: bruxoAtualizado
    });
};

const deleteBruxo = (req, res) => {
    const id = parseInt(req.params.id);
    const adminParam = req.query.admin;
    const MAIN_ADMIN = "Miranda";

    const autorizado = adminParam === "true" || adminParam === MAIN_ADMIN;

    if (!autorizado) {
        return res.status(403).json({
            status: 403,
            success: false,
            message: "Somente o Diretor pode executar essa magia!",
            error: "FORBIDDEN_ACCESS"
        });
    }

    // Verificar se o id é válido
    if (isNaN(id)) {
        return res.status(400).json({
            status: 400,
            success: false,
            message: "ID deve ser um número válido!",
            error: "VALIDATION_ERROR"
        });
    }

    // Verificar se existe o bruxo com o id que está sendo passado
    const bruxoParaRemover = bruxos.find(b => b.id === id);

    if (!bruxoParaRemover) {
        return res.status(404).json({
            status: 404,
            success: false,
            message: "Não é possível reparar o que não existe!",
            error: "WIZARD_NOT_FOUND"
        });
    }

    // Para remover o bruxo, vamos fazer uma gambiarra
    const bruxosFiltrados = bruxos.filter(bruxo => bruxo.id !== id);

    bruxos.splice(0, bruxos.length, ...bruxosFiltrados);

    res.status(200).json({
        status: 200,
        success: true,
        message: `Bruxo com id ${id} expulso de Hogwarts com sucesso!`,
    });
}

export { getAllBruxos, getBruxoById, createBruxo, updateBruxo, deleteBruxo };