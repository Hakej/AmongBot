module.exports = {
    name: 'sonia',
    usage: 'sonia',
    description: "przyzywa dobrego pieska",
    execute(message, args) {
        message.channel.send("Jestem dobrym pieskiem, błogosławiam twój dzień dobrocią", { files: ["./commands/data/sonia.jpg"] });
    }
}