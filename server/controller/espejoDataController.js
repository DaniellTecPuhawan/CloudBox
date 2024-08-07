const EspejoData = require('../models/espejoDataModel');

exports.getAllEspejoDatas = async (req, res) => {
  try {
    const espejoData = await EspejoData.find();
    res.json(espejoDatas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createEspejoData = async (req, res) => {
  const espejoData = new EspejoData({
    nombre: req.body.nombre,
    fechaNacimiento: req.body.fechaNacimiento,
    sexo: req.body.sexo,
    email: req.body.email,
    frecuenciaLavado: req.body.frecuenciaLavado,
    peinado: req.body.peinado,
    secado: req.body.secado,
    productos: req.body.productos,
    alergias: req.body.alergias,
    tipoAlergia: req.body.tipoAlergia,
    comentarios: req.body.comentarios,
    tipoCueroCabelludo: req.body.tipoCueroCabelludo,
    alteraciones: req.body.alteraciones,
    forma: req.body.forma,
    cantidad: req.body.cantidad,
    grosor: req.body.grosor,
    tacto: req.body.tacto,
    brillo: req.body.brillo,
    longitud: req.body.longitud,
    porcentajeCanas: req.body.porcentajeCanas,
    observaciones: req.body.observaciones
  
  });

  try {
    const newEspejoData = await espejoData.save();
    res.status(201).json(newEspejoData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/*

exports.updateWofData = async (req, res) => {
  try {
    const updatedWofData = await WofData.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedWofData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteWofData = async (req, res) => {
  try {
    await WofData.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

*/