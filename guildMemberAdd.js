const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const { log_channel } = require(`../config.json`);
const Canvas = require('@napi-rs/canvas');
const { request } = require('undici');

module.exports = {
    name: `guildMemberAdd`,
    description: `Événement lorsqu'un membre rejoins le serveur.`,
    async execute(member) {
        const user = member.user;
        console.log(`${user.displayName} (${member.id}) vient de rejoindre le serveur`);
        try {
            member.roles.add(`1038747400107479160`);
            console.log(`${user.displayName} (${member.id}) a reçu le rôle membre en rejoignant le serveur.`);
        } catch (error) {
            console.log(`Impossible de donner le rôle membre à ${user.displayName} (${member.id}).`);
            console.log(error);
        }

        const canvas = Canvas.createCanvas(700, 250);
		const context = canvas.getContext('2d');
        const background = await Canvas.loadImage(`./assets/background.png`);
        const applyText = (canvas, text) => {
            let fontSize = 60;
            do {
                context.font = `${fontSize -= 10}px arial`;
            } while (context.measureText(text).width > canvas.width - 295);
            return context.font;
        };
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        context.font = `bold 36px arial`;
        context.fillStyle = `#ffffff`;
        context.fillText(`Bienvenue sur le serveur !`, canvas.width / 3, canvas.height / 2.7);
        context.font = applyText(canvas, `${user.displayName}`);
        context.fillStyle = `#ffffff`;
        context.fillText(`${user.displayName}`, canvas.width / 2.55, canvas.height / 1.5);
        context.beginPath();
        context.arc(118, 125, 100, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();
        const { body } = await request(user.displayAvatarURL({ extension: 'png' }));
        const avatar = await Canvas.loadImage(await body.arrayBuffer());
        context.drawImage(avatar, 18, 25, 200, 200);
        const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'profile-image.png' });
        member.guild.channels.cache.get(`1141710521607921715`).send({ files: [attachment] });

        const joinEmbed = new EmbedBuilder()
		.setColor(`#00FF00`)
		.setTitle(`Un membre vient de rejoindre le serveur. 👋`)
		.setDescription(`Membre: ${user.displayName} \n ID: ${member.id}`)
		.setTimestamp();
		member.guild.channels.cache.get(log_channel).send({embeds: [joinEmbed]});
    }
}