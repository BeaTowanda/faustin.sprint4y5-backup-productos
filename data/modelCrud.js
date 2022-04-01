const { Console } = require('console');
const fs = require('fs');
const path = require('path');

let model = function (tableName){
    return {
        filePath: path.join(__dirname, '../data/' + tableName + '.json'),        
        readFile() {
            let fileContents = fs.readFileSync(this.filePath, 'utf8');                   
            if(fileContents) {
                return JSON.parse(fileContents);
            }         
            return [];
        },
        writeFile(contents) {
            let fileContents = JSON.stringify(contents, null, " ");
            fs.writeFileSync(this.filePath, fileContents);
        },
        nextId() {
            let rows = this.readFile();
            let lastRow = rows.pop(); 
            if (lastRow) {
                return ++lastRow.id;
            } 
            return 1;
        },
        all() {
            return this.readFile();
        },
        find(id) {
            let rows = this.readFile();
            let row = rows.find(function(elem){
                return elem.id == id
            });
            return row
            /*return rows.find(row => row.id == id)*/
        },
        findName(nombre) {
            let rows = this.readFile();
            let product = rows.find(function(elem){
                return elem.name == nombre})     
            return product;
        },
        findUser(nomUsuario) {
            let rows = this.readFile();
            let userId = rows.find(function(elem){
                return elem.usuario == nomUsuario})     
            return userId;
        },
        findSimilares(id){
            let rows = this.readFile();            
            if (rows.length !== 0){                
            let row = this.find(id);
            let rowType= row.tipo;          
            let array = rows.filter(function(elem){               
                return (elem.tipo == rowType) && (elem.id !== row.id)                  
            }  )
            
           return array
           }
        } ,           
        create(row) {
            let rows = this.readFile();
            row.id = this.nextId();
            rows.push(row); 
            this.writeFile(rows); 
            return row.id;
        },
        update(row) {
            let rows = this.readFile();
            console.log(row.id + " es id en update DE MODEL ")
            console.log(row.name + " es nombre update DE MODEL ")
            let updatedRows = rows.map(oneRow => {
                if (oneRow.id == row.id) {
                    return row;
                }

                return oneRow;
            }); 
            
            this.writeFile(updatedRows);

            return row.id;
        },
        delete(id) {
            let rows = this.readFile();
            let updatedRows = rows.filter(oneRow => oneRow.id != id); 

            this.writeFile(updatedRows);
        }
    }
}

module.exports = model;

