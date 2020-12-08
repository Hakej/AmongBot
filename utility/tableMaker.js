class tableMaker {
    constructor(rows, widths) {
        this.rows = rows;
        this.widths = widths;
    }

    makeTable() {
        var table = "```\n";
        table += this.addTableLine();

        this.rows.forEach((row) => {
            var index = 0;
            for (const prop in row) {
                const cell = row[prop].toString();
                table += `|`;
                table += cell;
                for (var i = 0; i < this.widths[index] - cell.length; i++) {
                    table += ' ';
                }
                index++;
            }
            table += "|\n"
            table += this.addTableLine();
        })

        table += "```";

        return table;
    }

    addTableLine() {
        var tableLine = "+";

        this.widths.forEach((value) => {
            for (var i = 0; i < value; i++) {
                tableLine += '-';
            }
            tableLine += '+';
        })
        tableLine += "\n";

        return tableLine;
    }
}

module.exports = tableMaker;