//import express
const express = require('express');
//import express handlebars
const exphbs  = require('express-handlebars');
//import body-parser
const bodyParser = require('body-parser');
const moment = require('moment');




const SettingsBill = require('./settings-bill');





const app = express();
//instantiate a copy
const settingsBill = SettingsBill();

//config express as middleware
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

//css public in use
app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


app.get('/', function(req , res){
    res.render('index', {
        setting: settingsBill.getSettings(),
        totals: settingsBill.totals(),
        color: settingsBill.totalClassName()
    })
});
//myRoute
app.post('/settings', function(req, res){
    
    settingsBill.setSettings({
        callCost:req.body.callCost,
        smsCost:req.body.smsCost,
        warningLevel:req.body.warningLevel,
        criticalLevel:req.body.criticalLevel
    })
    console.log(settingsBill.getSettings());
    res.redirect("/")
});

app.post('/action', function(req, res){
    // console.log(req.body.actionType, 'is the action type');

    settingsBill.recordAction(req.body.actionType);
    res.redirect("/")

});

app.get('/actions', function(req, res){
    
    let strMoment = settingsBill.actions();
    
    let updatedMoment = [];
    
    for (let i = 0; i < strMoment.length; i++) {
        updatedMoment.push({
            type: strMoment[i].type,
            cost: strMoment[i].cost,
            timestamp : (moment(strMoment[i].timestamp, 'YYYY-MM-DD hh:mm:ss a').fromNow())

        }); 
    };

    res.render('actions', {
        actions: updatedMoment
    });


});

app.get('/actions/:actionType', function(req, res){
    const actionType = req.params.actionType;
    let strMomentType = settingsBill.actionsFor(actionType);
    let momentListType = [];
    
    for (let i = 0; i < strMomentType.length; i++) {
        momentListType.push({
            type: strMomentType[i].type,
            cost: strMomentType[i].cost,
            timestamp : (moment(strMomentType[i].timestamp, 'YYYY-MM-DD hh:mm:ss a').fromNow())

        }); 
    };

    res.render('actions', {
        actions: momentListType
    });


});


const PORT = process.env.PORT || 3011;

app.listen(PORT, function(){
    console.log("App running at PORT:", PORT)
});
