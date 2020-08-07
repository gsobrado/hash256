import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{


  ngOnInit(): void {
   this.maxVueltas = 3000;
   this.startwith = "00";
  }

  title = 'hash256';

  hash = [];
  k = [];

  texto : string;
  textoResultado : string;
  startwith : string;
  maxVueltas : Number;
  mensajeResultado: string;
  calculoStart : boolean = false;

  calcular(){
    this.mensajeResultado = null;
    this.texto = this.texto + "{x}";
    let textoAuxiliar = this.texto;
    if(!this.maxVueltas){
      this.maxVueltas = 150;
    }
    for (let index = 0; index < this.maxVueltas; index++) {
      textoAuxiliar = this.texto.replace("{x}", index.toString())
      let resultado = this.sha256(textoAuxiliar);
      if(resultado.startsWith(this.startwith)){
        this.mensajeResultado = `Se Necesitarion ${index} vueltas para encontrar el hash`;
        this.textoResultado = resultado;
        this.texto = this.texto.replace("{x}", index.toString());
        break;
      }
    }
    if(!this.mensajeResultado){
      this.mensajeResultado = `Despues de ${this.maxVueltas} vueltas no se encontro un hash que empiece con ${this.startwith}`
      this.textoResultado = "";
      this.texto = this.texto.replace("{x}", "");
    }
  }

  parar(){
    this.calculoStart = false;
  }

  cambiaTexto(){
    this.mensajeResultado = "";
    if(this.texto == ""){
      this.textoResultado = "";
    }else{
      this.textoResultado = this.sha256(this.texto);
    }
  }

  sha256(textoEntrada) : string {    
    var mathPow = Math.pow;
    var maxWord = mathPow(2, 32);
    var i, j; // Used as a counter across the whole file
    var result = ''
  
    var words = [];
    var asciiBitLength = this.texto.length * 8;
    
    //* caching results is optional - remove/add slash from front of this line to toggle
    // Initial hash value: first 32 bits of the fractional parts of the square roots of the first 8 primes
    // (we actually calculate the first 64, but extra values are just ignored)
    var hash = this.hash = this.hash || [];
    // Round constants: first 32 bits of the fractional parts of the cube roots of the first 64 primes
    var k = this.k = this.k || [];

    var primeCounter = k.length;
    /*/
    var hash = [], k = [];
    var primeCounter = 0;
    //*/
  
    var isComposite = {};
    for (var candidate = 2; primeCounter < 64; candidate++) {
      if (!isComposite[candidate]) {
        for (i = 0; i < 313; i += candidate) {
          isComposite[i] = candidate;
        }
        hash[primeCounter] = (mathPow(candidate, .5)*maxWord)|0;
        k[primeCounter++] = (mathPow(candidate, 1/3)*maxWord)|0;
      }
    }
    
    var texto = textoEntrada;

    texto += '\x80' // Append Ƈ' bit (plus zero padding)
    while (texto.length % 64 - 56) texto += '\x00' // More zero padding
    for (i = 0; i < texto.length; i++) {
      j = texto.charCodeAt(i);
      if (j >> 8) return; // ASCII check: only accept characters in range 0-255
      words[i >> 2] |= j << ((3 - i) % 4) * 8;
    }
    words[words.length] = ((asciiBitLength / maxWord) | 0);
    words[words.length] = (asciiBitLength)
    
    // process each chunk
    for (j = 0; j < words.length;) {
      var w = words.slice(j, j += 16); // The message is expanded into 64 words as part of the iteration
      var oldHash = hash;
      // This is now the undefinedworking hash", often labelled as variables a...g
      // (we have to truncate as well, otherwise extra entries at the end accumulate
      hash = hash.slice(0, 8);
      
      for (i = 0; i < 64; i++) {
        var i2 = i + j;
        // Expand the message into 64 words
        // Used below if 
        var w15 = w[i - 15], w2 = w[i - 2];
  
        // Iterate
        var a =  hash[0], e =  hash[4];
        var temp1 =  hash[7] + (this.rightRotate(e, 6) ^ this.rightRotate(e, 11) ^ this.rightRotate(e, 25)) + ((e &  hash[5]) ^ ((~e) &  hash[6])) 
        + k[i] + (w[i] = (i < 16) ? w[i] : ( w[i - 16] + (this.rightRotate(w15, 7) ^ this.rightRotate(w15, 18) ^ (w15>>>3)) + w[i - 7] 
        + (this.rightRotate(w2, 17) ^ this.rightRotate(w2, 19) ^ (w2 >>> 10))) | 0);

        // This is only used once, so *could* be moved below, but it only saves 4 bytes and makes things unreadble
        var temp2 = (this.rightRotate(a, 2) ^ this.rightRotate(a, 13) ^ this.rightRotate(a, 22)) // S0
          + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2])); // maj
        
          hash = [(temp1 + temp2)|0].concat(hash); // We don't bother trimming off the extra ones, they're harmless as long as we're truncating when we do the slice()
          hash[4] = (hash[4] + temp1) | 0;
      }
      
      for (i = 0; i < 8; i++) {
        hash[i] = (hash[i] + oldHash[i]) | 0;
      }
    }
    
    for (i = 0; i < 8; i++) {
      for (j = 3; j + 1; j--) {
        var b = (hash[i] >> (j * 8)) & 255;
        result += ((b < 16) ? 0 : '') + b.toString(16);
      }
    }
    return result;
  };

  rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  };

}
