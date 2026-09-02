const { expect } = require('chai');
const sinon = require('sinon');
const DocumentosModel = require("../../../app/models/DocumentosModel");
const {
    obtenerDocumentos
} = require("../../../app/services/documentosServices");
const proxyquire = require('proxyquire');

describe('documentosService.obtenerDocumentos', () => {
    afterEach(() => {
        sinon.restore(); // Restaurar los mocks después de cada prueba
    });

    it('debería retornar documentos si existen', async () => {
        const documentosMock = [{ _id: '1', nombre: 'Doc1' }, { _id: '2', nombre: 'Doc2' }];

        sortStub = sinon.stub().resolves(documentosMock);
        findStub = sinon.stub(DocumentosModel, 'find').returns({ sort: sortStub });

        const resultado = await obtenerDocumentos();

        expect(findStub.calledOnce).to.be.true;
        expect(sortStub.calledWith({ createdAt: 1 })).to.be.true;
        expect(resultado).to.deep.equal(documentosMock);
    });

    it('deberia de retornar un arreglo vacio si no hay documentos', async () => {
        const documentosMock = [];

        sortStub = sinon.stub().resolves(documentosMock);
        findStub = sinon.stub(DocumentosModel, 'find').returns({ sort: sortStub });

        const resultado = await obtenerDocumentos();

        expect(findStub.calledOnce).to.be.true;
        expect(sortStub.calledWith({ createdAt: 1 })).to.be.true;
        expect(resultado).to.deep.equal(documentosMock);
    });
});

describe('documentosService.crearDocumento', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('debería crear un documento correctamente y devolverlo', async () => {
        const data = {
            estado_documento: 'Habilitado',
            tipo: 'emision',
            no_oficio: '1',
            direccion_departamento: 'Departamento de Desarrollo Tecnologico',
        };

        const saveStub = sinon.stub().resolves({ _id: '68810a56ce3d62e17322979b', ...data });

        const DocumentosModelStub = sinon.stub().returns({ save: saveStub });

        // Reemplaza el módulo de modelos solo para esta prueba
        const { crearDocumento } = proxyquire("../../../app/services/documentosServices", {
            "../models/DocumentosModel": DocumentosModelStub,
        });

        const resultado = await crearDocumento(data);

        expect(DocumentosModelStub.calledOnceWithExactly(data)).to.be.true;
        expect(saveStub.calledOnce).to.be.true;
        expect(resultado).to.deep.equal({ _id: '68810a56ce3d62e17322979b', ...data });
    });
});