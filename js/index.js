class BaseCharacter {
  constructor(name, hp, ap) {
    this.name=name;
    this.hp=hp;
    this.ap=ap;
    this.maxHp=hp;
    this.alive=true;
  }
  attack(character, damage){
    if(this.alive==false){
      return;
    }
    character.getHurt(damage);
  }
  getHurt(damage){
    this.hp-=damage;
    if(this.hp<=0){
      this.die();
    }

    var _this = this;
    var i = 1;
    _this.id = setInterval(function(){

      if(i==1){
        _this.element.getElementsByClassName("effect-image")[0].style.display = "block";
        _this.element.getElementsByClassName("hurt-text")[0].classList.add("attacked");
        _this.element.getElementsByClassName("hurt-text")[0].textContent = damage;
      }

      _this.element.getElementsByClassName("effect-image")[0].src = 'images/effect/blade/'+ i +'.png';
      i++;

      if (i > 8) {
        _this.element.getElementsByClassName("effect-image")[0].style.display = "none";
        _this.element.getElementsByClassName("hurt-text")[0].classList.remove("attacked");
        _this.element.getElementsByClassName("hurt-text")[0].textContent = "";
        clearInterval(_this.id);
      }
    },50);
  }
  die(){
    this.alive = false;
  }
  updateHtml(hpElement, hurtElement){
    hpElement.textContent=this.hp;
    hurtElement.style.width = (100 -this.hp/this.maxHp * 100)+"%";
  }
}

class Hero extends BaseCharacter{
  constructor(name,hp,ap){
    super(name,hp,ap);

    this.element = document.getElementById("hero-image-block");
    this.hpElement = document.getElementById("hero-hp");
    this.maxHpElement = document.getElementById("hero-max-hp");
    this.hurtElement = document.getElementById("hero-hp-hurt");

    this.hpElement.textContent = this.hp;
    this.maxHpElement.textContent = this.hp;

    console.log("召喚英雄 " + this.name + "！");
  }
  <!--傷害公式不同 所以在不同class中有各自的attack method-->
  attack(character){
    var damage = Math.random()*(this.ap/2)+(this.ap/2);
    super.attack(character,Math.floor(damage));
  }
  getHurt(damage){
    super.getHurt(damage);
    this.updateHtml(this.hpElement, this.hurtElement);
  }
  heal(){
    this.hp+=30;
    if(this.hp>this.maxHp){
      this.hp = this.maxHp;
    }
    this.updateHtml(this.hpElement, this.hurtElement);

    var _this = this;
    var i = 1;
    _this.id = setInterval(function(){

      if(i==1){
        _this.element.getElementsByClassName("effect-image")[0].style.display = "block";
        _this.element.getElementsByClassName("heal-text")[0].classList.add("healed");
        _this.element.getElementsByClassName("heal-text")[0].textContent = "30";
      }

      _this.element.getElementsByClassName("effect-image")[0].src = 'images/effect/heal/'+ i +'.png';-
      i++;

      if (i > 8) {
        _this.element.getElementsByClassName("effect-image")[0].style.display = "none";
        _this.element.getElementsByClassName("heal-text")[0].classList.remove("healed");
        _this.element.getElementsByClassName("heal-text")[0].textContent = "";
        clearInterval(_this.id);
      }
    },50);
  }
}

class Monster extends BaseCharacter {
  constructor(name,hp,ap) {
    super(name,hp,ap);
    <!-- 物件和畫面建立連結 -->
    this.element = document.getElementById("monster-image-block");
    this.hpElement = document.getElementById("monster-hp");
    this.maxHpElement = document.getElementById("monster-max-hp");
    this.hurtElement = document.getElementById("monster-hp-hurt");

    this.hpElement.textContent = this.hp;
    this.maxHpElement.textContent = this.hp;

    console.log("遇到怪獸了 " + this.name + "！");
  }
  attack(character){
    var damage = Math.random()*(this.ap/2)+(this.ap/2);
    super.attack(character,Math.floor(damage));
  }
  getHurt(damage){
    super.getHurt(damage);
    this.updateHtml(this.hpElement, this.hurtElement);
  }
}

function addSkillEvent(){
  var skill = document.getElementById("skill");
  skill.onclick = function(){
    heroAttack();
  }
}
addSkillEvent();
var heal = document.getElementById("heal");
heal.onclick = function(){
  heroHeal();
}

function heroHeal(){
  <!--hide skill block-->
  document.getElementsByClassName("skill-block")[0].style.display="none";

  setTimeout(function(){
    <!--heal effect and heal text -->
    setTimeout(function(){
      hero.heal();
    },500);
  },100);
  setTimeout(function(){
    monster.element.classList.add("attacking");
    setTimeout(function(){
      monster.attack(hero);
      monster.element.classList.remove("attacking");
      endTurn();
      if(hero.alive == false){
        <!--game over-->
        finish();
      }else{
        document.getElementsByClassName("skill-block")[0].style.display = "block";
      }
    },500);
  },1100);
}

var rounds = 10;
function endTurn(){
  rounds--;
  document.getElementById("round-num").textContent = rounds;
  if (rounds < 1) {
    <!-- game over-->
    finish();
  }
}

function heroAttack(){
  document.getElementsByClassName("skill-block")[0].style.display="none";

  <!-- hero -->
  setTimeout(function(){
    hero.element.classList.add("attacking");
    setTimeout(function(){
      hero.attack(monster);
      hero.element.classList.remove("attacking");
    },500)
  },100);
  <!-- monster -->
  setTimeout(function(){
    if(monster.alive){
      monster.element.classList.add("attacking");
      setTimeout(function(){
        monster.attack(hero);
        monster.element.classList.remove("attacking");
        endTurn();
        if(hero.alive == false){
          <!--game over-->
          finish();
        }else{
          document.getElementsByClassName("skill-block")[0].style.display = "block";
        }
      },500);
    }else{
      <!-- game over -->
      finish();
    }
  },1100);

}

function finish(){
  var dialog = document.getElementById("dialog");
  dialog.style.display = "block";
  if(hero.alive == false){
    dialog.classList.add("lose");
  }else{
    dialog.classList.add("win");
  }
}

document.onkeyup = function(event){
  var key = String.fromCharCode(event.keyCode);
  if(key == "A"){
    heroAttack();
  }else if(key=="D"){
    heroHeal();
  }
}

var hero = new Hero("Bernard", 130, 30);
var monster = new Monster("Skeleton", 130, 10);
