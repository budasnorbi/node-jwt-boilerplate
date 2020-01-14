const express = require('express');
const router = express.Router();

// Middlewares
const checkAuth = require('../../middleware/checkAuth');
const checkRole = require('../../middleware/checkRole');

// Model
const Pass = require('../../models/Pass');

// Validations
const validatePassCreateInput = require('../../validation/pass-create');
const validatePassChangeInput = require('../../validation/pass-change');

// @route GET api/pass/
// @desc Get all passes
// @access Protected
router.get('/', checkAuth, checkRole(['edző']), async (req, res) => {
  try{
    let passes = await Pass.find({});

    if(!passes){
     return res.json({ msg: 'Jelenleg nincs még bérlet felvéve'});
    }

    res.json(passes);
  } catch(err) {
    console.log(err);
    res.status(400).json(err);
  }
});

// @route POST api/pass/
// @desc Create a pass
// @access Protected
router.post('/', checkAuth, checkRole(['edző']), async (req, res) => {
  const { errors, isValid } = validatePassCreateInput(req.body);

  // Check validation
  if(!isValid){
    return res.status(400).json(errors);
  }

  const { name } = req.body;

  try{
    const pass = await Pass.findOne({ name });

    if(pass){
      errors.name = 'Már létezik ilyen bérlet elnevezés';
      return res.status(400).json(errors);
    }

    const newPass = new Pass(req.body);
    await newPass.save();

    res.json({msg:'Bérlet létrehozva'});
  } catch(err) {
    console.log(err);
    res.status(400).json(err);
  }
});

// @route PATCH api/pass/
// @desc Update a pass
// @access Protected
router.patch('/:passID', checkAuth, checkRole(['edző']), async (req, res) => {
  const {passID} = req.params;

  if(!passID){
    return res.status(400).json({ msg: 'Hibás bérlet azonosító'});
  }

  const { errors, isValid } = validatePassChangeInput(req.body);

  // Check validation
  if(!isValid){
    return res.status(400).json(errors);
  }

  const { name, count } = req.body;


  try{
    const pass = await Pass.findOne({ name });

    if(pass){
      return res.status(400).json({ msg: 'Már van ilyen nevű bérlet'});
    }
    
    await Pass.findOneAndUpdate({_id: passID}, { $set: { name, count}});
    res.json({ msg: 'Sikeres bérlet frissítés'});
  } catch(err) {
    console.log(err);
    res.status(400).json(err);
  }
});

// @route DELETE api/pass/
// @desc Delete a pass
// @access Protected
router.delete('/:passID', checkAuth, checkRole(['edző']), async (req, res) => {
  const {passID} = req.params;

  if(!passID){
    return res.status(400).json({ msg: 'Hibás bérlet azonosító'});
  }

  try {
    await Pass.findOneAndDelete({_id: passID});

    res.json({ msg: 'Sikeres bérlet törlés'});
  } catch (err) {
    res.json({ msg: 'Sikertelen bérlet törlés'});
  }
});

module.exports = router;