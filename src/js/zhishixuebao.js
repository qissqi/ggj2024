
// 角色类
class Player {
  constructor(initialEnergy, initialMood, initialHealth, initialMoney,initialKnowledge) {
    this.energy = initialEnergy;
    this.mood = initialMood;
    this.health = initialHealth;
    this.money = initialMoney;
    this.knowledge = initialKnowledge;
    this.actionPoint=4;
    
    this.maxEnergy = 20;
    this.maxMood = 20;
    this.maxKnowledge = 100;
    this.maxHealth = 100;
  }

}

// 卡牌
class Card {
  keep = false

  constructor(name,desc="",img="", energy=[0], mood=[0], health=[0], money=[0],knowledge=[0]) {
    this.name = name;
    this.desc = desc;
    this.img=img;
    this.energy = energy;
    this.mood = mood;
    this.health = health;
    this.money = money;
    this.knowledge = knowledge;
    this.init()
  }

  init(){
    this.renergy = this.generateRandomNumber(this.energy);
    this.rmood = this.generateRandomNumber(this.mood);
    this.rhealth = this.generateRandomNumber(this.health);
    this.rmoney = this.generateRandomNumber(this.money);
    this.rknowledge = this.generateRandomNumber(this.knowledge);

  }

  checkAvailable(gm){
    return true
  
  }

  // 使用卡牌的方法
  use(gm) {
    if(this.keep){
      this.keep=false
      gm.keepCard = this
      gm.newDay()
      return this
    }
    return this.cardEffect(gm)
  }

  cardEffect(gm) {
    console.log(`使用了卡牌：${this.name}`);

    console.log(`体力：${gm.player.energy} + ${this.renergy}=${gm.player.energy + this.renergy}`);
    gm.player.energy = gm.player.energy + this.renergy >= gm.player.maxEnergy?gm.player.maxEnergy:gm.player.energy + this.renergy 

    console.log(`心情：${gm.player.mood} + ${this.rmood}=${gm.player.mood + this.rmood}`);
    gm.player. mood = gm.player.mood + this.rmood >= gm.player.maxMood?gm.player.maxMood:gm.player.mood + this.rmood

    console.log(`健康：${gm.player.health} + ${this.rhealth}=${gm.player.health + this.rhealth}`);
    gm.player.health = gm.player.health + this.rhealth >= gm.player.maxHealth?gm.player.maxHealth:gm.player.health + this.rhealth

    console.log(`金钱：${gm.player.money} + ${this.rmoney}=${gm.player.money + this.rmoney}`);
    gm.player.money = gm.player.money + this.rmoney

    console.log(`知识：${gm.player.knowledge} + ${this.rknowledge}=${gm.player.knowledge + this.rknowledge}`);
    gm.player.knowledge = gm.player.knowledge + this.rknowledge >= gm.player.maxKnowledge?gm.player.maxKnowledge:gm.player.knowledge + this.rknowledge
    return null
  }
  
  generateRandomNumber(range) {
    var min = range[0]
    var max = range[range.length - 1]
    // 生成min到max之间的随机浮点数
    const randomFloat = Math.random() * (max - min + 1) + min;
    
    // 对随机浮点数向下取整，得到整数
    var randomInt = Math.floor(randomFloat);
    
    return randomInt;
  }


}

//听歌
class Card_Music extends Card {
  cardEffect(gm){
    gm.playAudio("../static/audio/zood.mp3")
  }
}

//玩手机
class Card_Phone extends Card {
  cardEffect(gm){
    this.openWeb()
    if(Math.random() < 0.7){
      var nc = gm.normalCards()
      return nc[Math.floor(Math.random() * (nc.length-1) + 1)]
    }
    else{
      return gm.getSpecialCard()
    }
  }

  openWeb(){
    webs = [
      "https://www.agedm.org/",
      "https://ys.mihoyo.com/main/",
    ]
    web = webs[Math.floor(Math.random() * webs.length)]

    window.open(web, '_blank');
  }

}

// 直播
class Card_Stream extends Card {

}

//发行唱片
class Card_Album extends Card {

}

//演讲
class Card_Speak extends Card {

}

//微博之夜
class Card_Weibo extends Card {

}

//音乐盛典
class Card_MusicFestival extends Card {

}

//签约唱片公司
class Card_SignRecord extends Card {

}

//成为代言人
class Card_Agent extends Card {

}



class Game_Manager {
  keepCard = null
  myCards = []
  player = new Player(10, 10, 100, 1000,0)
  audio = new Audio()
  signed = false

  // 普通卡牌
  card_learn(){return new Card("学知识","丁真努力学习","../static/img/知识学爆2.jpg",[-2,-3],[-1,-2],[0],[-10,-30],[1,2])}
  card_ride(){return new Card("骑小马","丁真骑着小马珍珠到处测其他人的马","../static/img/骑小马.png",[0],[-4])}
  card_sleep(){return new Card("睡大觉","丁真开始睡dajiao","../static/dz_test.jpeg",[3,4],[2,3])}
  card_smoke(){return new Card("抽电子烟","丁真开始吞云吐雾","../static/img/电子烟.png",[0],[6],[-1,-2],[-10])}
  card_listen_music(){return new Card_Music("听歌","丁真开始听理塘金曲","../static/img/专辑.jpg",[0],[1])}
  card_play(){return new Card("陪雪豹玩耍","丁真愉快地和动物朋友玩耍","../static/img/雪豹.jpeg",[-1],[1,2])}
  card_phone(){return new Card_Phone("玩手机","丁真使用5G上网, 随机生成一张其他卡牌","../static/img/玩手机.jpg")}
  
  //特殊卡牌
  //多次卡牌
  card_stream (){return new Card("直播","丁真开始练习藏话","../static/img/直播1.png",[-2],[-1],[0],[20])}
  card_album(){return new Card_Album("发行专辑","丁真向着格莱美进发","../static/img/唱歌.jpeg",[-3],[-1],[0],[40])}
  
  //单次卡牌
  card_speak (){return new Card_Speak("联合国演讲","丁真在粘合国上为动物朋友演讲","../static/img/联合国演讲.png",[-3],[-3],[0],[1000])}
  card_weibo (){return new Card_Weibo("微博之夜","丁真在微博之夜上上下下","",[-3],[-3],[0],[1000])}
  card_musicFestival (){return new Card_MusicFestival("亚洲音乐盛典","","",[-3],[-3],[0],[1000])}
  card_signRecord (){return new Card_SignRecord("签约唱片公司","理塘王子","")}
  card_agent (){return new Card_Agent("成为锐刻5代言人","丁真向传统派发起挑战, 抽电子烟不再花费金钱","")}
  
  normalCards (){return [this.card_phone(),this.card_ride(), this.card_sleep(), this.card_smoke(), this.card_listen_music(), this.card_play()]}
  specialCards (){
    var cards = [this.card_stream()]
    if(this.signed)
      cards.push(this.card_album())
    return cards
  }
  
  
  constructor() {
    this.init()
  }
  
  init() {
    this.specialCardsOnce = [this.card_speak(), this.card_weibo(), this.card_musicFestival(), this.card_signRecord(), this.card_agent()]
    this.days = 0;
    this.newDay()
  }

  newDay(){
    this.player.actionPoint=4
    this.days ++ 
    console.log(`第${this.days}天`)
    this.myCards = this.getCards(5)
  }

  
  checkCardAvailable(index) {
    var card = this.myCards[index]
    if(this.player.actionPoint<=0)
      return false

    if(this.player.energy < card.renergy)
      return false
    if(this.player.mood < card.rmood)
      return false
    if(this.player.money < card.rmoney)
      return false

    return this.myCards[index].checkAvailable(this)
  }
  
  useCard(index) {
    if(!this.checkCardAvailable(index)){
      console.log("卡牌不可用")
      return
    }
    var c = this.myCards[index].use(this)
    this.myCards[index] = c;
    this.player.actionPoint --
    console.log(this.myCards)
  }

  getCards(nums){
    var cards = [this.card_learn()]
    for (let i = 0; i < nums; i++) {
      var ncards = this.normalCards()
      var randomIndex = Math.floor(Math.random() * ncards.length);
      cards.push(ncards[randomIndex])
    }
    return cards
  }

  getSpecialCard(){
    var cards = this.specialCards()
    var randomIndex = Math.floor(Math.random() * cards.length + this.specialCardsOnce.length);
    if(randomIndex < this.specialCardsOnce.length){
      var card = this.specialCardsOnce[randomIndex]
      this.specialCardsOnce.splice(randomIndex, 1)
      return card
    }
    else{
      return cards[randomIndex - this.specialCardsOnce.length]
    }
  }


  endDay(){
    var leftCards = this.myCards.slice(1, 6).filter(c=>c!=null)
    console.log("leftCards", leftCards)
    if(leftCards.length == 0)
    {
      this.keepCard = null
      this.newDay()
    }
    else if(leftCards.length == 1)
    {
      this.keepCard = leftCards[0]
      this.newDay()
    }

    leftCards.forEach(c => {
      c.keep=true
    });
  }

  playAudio(url){
    this.audio.src = url
    this.audio.load()
    this.audio.play()
  
  }

  test(){
    console.log("GameManager")
    console.log(this.myCards)
  }

}

function test(){
  console.log("Test")
}

var gm = new Game_Manager()


// var c1 =gm.normalCards()
// console.log(gm.card_learn().desc)
// c1.forEach(c => {
//   console.log(c.desc)
// });
// var c2 =gm.specialCards()
// c2.forEach(c => {
//   console.log(c.desc)
// });
// var c3 = gm.specialCardsOnce
// c3.forEach(c => {
//   console.log(c.desc)
// });

