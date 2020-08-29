const Discord = require('discord.js');
const rapidApiCoronaVirusKey = "";
const discordAuthToken = "";
const client = new Discord.Client();
const prefix = "?";
const casesCommand = "cases";
const registerCommand = "register";
const instructionsCommand = "instructions";
client.on('ready', () => {
 console.log(`Logged in as ${client.user.tag}!`);
 });

client.on('message', msg => {
    if (msg.content.startsWith(prefix + casesCommand)) {
        param = msg.content.split(" ");
        if (param.length > 1)
        {
            var unirest = require("unirest");

            var req = unirest("GET", "https://coronavirus-monitor.p.rapidapi.com/coronavirus/latest_stat_by_country.php");
        
            req.query({
                "country" : param[1]
            })

            req.headers({
                "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
                "x-rapidapi-key": rapidApiCoronaVirusKey
            });
        
            req.end(function (res) {
                if (res.error) throw new Error(res.error);
                console.log(res.body);
                data = JSON.parse(res.body);
                if(data.latest_stat_by_country.length) {
                    latestData = data.latest_stat_by_country[0];
                    msg.reply("Coronavirus in " + latestData.country_name + " - Total Cases: " + latestData.total_cases + " , Total Deaths: " + (latestData.total_deaths === '' ? 0 : latestData.total_deaths) + " ( as of " + latestData.record_date + " GMT )");    
                }
                else
                {
                    msg.reply("Could not find any Coronavirus info for " + (data.country === '' ? "this country." : data.country + ".") )
                }
            });
        }
        else
        {
            var unirest = require("unirest");

            var req = unirest("GET", "https://coronavirus-monitor.p.rapidapi.com/coronavirus/worldstat.php");
        
            req.headers({
                "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
                "x-rapidapi-key": rapidApiCoronaVirusKey
            });
        
            req.end(function (res) {
                if (res.error) throw new Error(res.error);
                console.log(res.body);
                data = JSON.parse(res.body);
                msg.reply("Total Cases: "+ data.total_cases + " , Total Deaths: " + data.total_deaths);
            });
        }
       
    }
    
    if (msg.content.startsWith(prefix + instructionsCommand)) {
        msg.reply("\n 1. Wash your hands frequently for at least 20 seconds\n 2. Maintain social distancing \n 3. Avoid touching eyes, nose and mouth \n 4. Practice respiratory hygiene \n 5. If you have fever, cough and difficulty breathing, seek medical care early")
    } 
    //Change users Discord channel nickname in format A.XXXX , where A is first letter of name and X is random number
    if (msg.content.startsWith(prefix + registerCommand)) {
        param = msg.content.split(" ");
        var generatedName;
        if (param.length > 1)
        {
            generatedName = param[1].charAt(0).toUpperCase();;
        }
        else
        {
            generatedName = msg.author.username.charAt(0).toUpperCase();
        }

        generatedName += ("." + makeId());
        if (msg.guild.me.hasPermission('MANAGE_NICKNAMES')) {
            msg.member.setNickname(generatedName);
        }
        else 
        {
            msg.channel.send('I don\'t have permission to change your nickname!');
        }
    }
 });

client.login(discordAuthToken);


function makeId(length) {
    var result           = '';
    var characters       = '0123456789';
    for ( var i = 0; i < 4; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * 10));
    }
    return result;
 }
