// Сдлеать контроль бота только у меня и у Жени.
// Сделать команду /roll, которая генерит число от 0 до 100.
// Сдлеать команду /flip, которая выдаёт результат орёл/решка.
// Попробовать красиво оформить код.
const Discord = require('discord.js');
const botconfig = require('./botconfig.json');
const client = new Discord.Client();

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

var roles = {
    dire: null,
    rad: null
};

function set_rad_dire_roles() {
    roles.rad = client.guilds.get('356758714339950592').roles.find(val => val.name === 'Radiant');
    roles.dire =  client.guilds.get('356758714339950592').roles.find(val => val.name === 'Dire');
}

function give_role(role, nicks) {
    switch (role) {
        case 'rad' :
        case 'radiant' :
        case 'r' : role = roles.rad; break;
        case 'dire' :
        case 'dir' :
        case 'd' : role = roles.dire; break;
        default : role = null;
    }
    if (role == null) throw new Error('Incorrect role');
    var added = new Array();
    client.guilds.get('356758714339950592').members.forEach(member => {
        member.nickname == null ? name = member.user.username.toLowerCase() : name = member.nickname.toLowerCase();
        nicks.forEach(nick => {
            if (nick == name) {
                member.addRole(role);
                added.push(name.capitalize());
            }
        });
    });
    role == roles.rad ? role = 'radiant' : role = 'dire';
    console.log(added.length);
    if (added.length == 0) {
        return 'Something went wrong';
    } else {
        return `${added.length} users added to ${role}. (${added.join(', ')})`;
    }
}

function select_caps(nicks = []) {
    if (nicks.length == 0) { return 'You haven\'t enter nicks required to select caps'; }
    else if (nicks.length == 1) { return 'You should enter more than 1 nick for selection process'; }
    var caps = new Array();
    caps.push( nicks[ Math.floor(Math.random() * nicks.length) ].capitalize() );
    nicks.splice(nicks.indexOf(caps[0]), 1);
    caps.push( nicks[ Math.floor(Math.random() * nicks.length) ].capitalize() );
    return `Selected caps: ${caps.join(', ')}`
}

function select_nums(nums = []) {
    nums.forEach((num) => { nums[nums.indexOf(num)] = Number(num) });
    console.log(nums);
    console.log(nums.length);
    console.log(typeof nums[0], typeof nums[1]);
    if (nums.length == 0) {
        result = Math.floor(Math.random() * 101)
    }
    else if (nums.length == 1 && typeof nums[0] == 'number') {
        result = Math.floor(Math.random() * (nums[0] + 1));
        console.log(result);
    } else if (nums.length == 2 && typeof nums[0] == 'number' && typeof nums[1] == 'number') {
        result = Math.floor(Math.random() * (nums[1] - nums[0] + 1)) + nums[0];
        console.log(result);
    } else {
        result = 'Incorrect input data';
        console.log(result);
    }
    return result
}

function flip() {
    one_or_two = Math.floor(Math.random() * 2);
    switch (one_or_two) {
        case 0: return 'Eagle';
        case 1: return 'Tails';
        default: return 'Wtf??!';
    }
}

function grub_rad_dire_roles() {
    roles.dire.members.forEach(member => {
        member.removeRole(roles.dire.id);
    });
    roles.rad.members.forEach(member => {
        member.removeRole(roles.rad.id);
    });
    return 'Teams have been cleared'
}

function convert_to_lower_case(arr) {
    var temp_arr = new Array();
    arr.forEach(part => {
        temp_arr.push(part.toLowerCase());
    });
    return temp_arr;
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('Teams Manager'); // or Lobby Manager
    set_rad_dire_roles();
});

client.on('message', msg => {
    var text = msg.content;
    if (text[0] == '/') {
        text = convert_to_lower_case(text.slice(1).split(' '));
        command = text[0];
        if (command == 'set') {
            team = text[1];
            if (team == 'rad' || team == 'radiant' || team == 'r' || team == 'd' || team == 'dire' || team == 'dir') {
                members = text.slice(2);
                console.log(`Setting ${team}... ${members.join(', ')}`);
                if (members.length != 0) {
                    try { msg.reply(give_role(team, members)); }
                    catch (e) { msg.reply('Something went wrong'); }
                } else {
                    msg.reply(`Enter nicknames of users, who should be in ${team}`);
                }
            } else { msg.reply('Incorrect team'); }   
        } else if (command == 'clear' || command == 'clr') {
            console.log('Clearing teams...');
            msg.reply(grub_rad_dire_roles());
        } else if (command == 'caps') {
            members = text.slice(1);
            console.log(`Caps selection process... ${members.join(', ')}`);
            msg.reply(select_caps(members));
        } else if (command == 'rand' || command == 'random' || command == 'r') {
            var nums = new Array();
            switch (text[2]) {
                case '-' :
                case 'to' : nums[0] = text[1]; nums[1] = text[3]; break;
                default : nums[0] = text[1]; nums[1] = text[2];
            }
            console.log(`Random... ${nums[0]}, ${nums[1]}`);
            nums = ((arr) => {
                for (i = 0; i < 2; i++) {
                    if (arr.indexOf(undefined) != -1) { // When indexOf(smthg) returns -1 means that smthg is not in arr.
                        arr.splice(arr.indexOf(undefined), 1);
                    }
                }
                return arr;
            })(nums);
            msg.reply(select_nums(nums));
        } else if (command == 'flipc' || command == 'flpc' || command == 'flipcoin' || command == 'ебубориноочкозаeagle') {
            msg.reply(flip());
        } else if (command = 'roll') {

        }
    }
});

client.login(botconfig.token);
