
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
    this.maxActionPoint = 4;
  }

}

// 卡牌
class Card {
  isRandom=false
  keep = false
  used = false
  isStatic = false
  usage_status=0

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
    if(gm.player.energy < 0)
      gm.player.energy = 0

    console.log(`心情：${gm.player.mood} + ${this.rmood}=${gm.player.mood + this.rmood}`);
    gm.player. mood = gm.player.mood + this.rmood >= gm.player.maxMood?gm.player.maxMood:gm.player.mood + this.rmood
    if (gm.player.mood < 0)
      gm.player.mood = 0

    console.log(`健康：${gm.player.health} + ${this.rhealth}=${gm.player.health + this.rhealth}`);
    gm.player.health = gm.player.health + this.rhealth >= gm.player.maxHealth?gm.player.maxHealth:gm.player.health + this.rhealth
    if (gm.player.health < 0)
      gm.player.health = 0

    console.log(`金钱：${gm.player.money} + ${this.rmoney}=${gm.player.money + this.rmoney}`);
    gm.player.money = gm.player.money + this.rmoney
    if (gm.player.money < 0)
      gm.player.money = 0

    console.log(`知识：${gm.player.knowledge} + ${this.rknowledge}=${gm.player.knowledge + this.rknowledge}`);
    gm.player.knowledge = gm.player.knowledge + this.rknowledge >= gm.player.maxKnowledge?gm.player.maxKnowledge:gm.player.knowledge + this.rknowledge
    if (gm.player.knowledge < 0)
      gm.player.knowledge = 0

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

class Card_Smoke extends Card {
  checkAvailable(gm){
    if(gm.isAgent){
      this.rmoney = 0
    }
    return super.checkAvailable(gm)
  }
}

//听歌
class Card_Music extends Card {
  cardEffect(gm){
    if(gm.music_list.length == 0){
      gm.music_list.push({name: '保持静音', call_back: () => {gm.playAudio("../static/audio/xbbz.mp3");gm.music_mute=true }})
      gm.music_list.push({name: '无', call_back: () => {gm.playAudio("../static/audio/xbbz.mp3");gm.music_mute=false }})
      if(gm.music_found.length==0){
        gm.music_list.push(gm.music_all[0])
        gm.music_all.shift()
      }

    }
    if(gm.music_found.length!=0){
      console.log("gm.music_found",gm.music_found)
      gm.music_list.push(gm.music_found[0])
      var music=gm.music_found[0]
      if(!gm.music_mute && gm.audio.paused){
        console.log(music.url)
        gm.playAudio(music.url)
        gm.music_selected = music
      }
      gm.music_found.shift()
    }
    else{
      console.log()
      console.log("gm.music_list",gm.music_list)
      var r = Math.floor(Math.random()*(gm.music_list.length-2)+2)
      var music =gm.music_list[r]
      if(!gm.music_mute && gm.audio.paused){
        console.log(music.url)
        gm.playAudio(music.url)
        gm.music_selected = music
      }
    }

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
    var webs = [
      "https://www.bilibili.com/video/BV1GJ411x7h7",
      "https://ys.mihoyo.com/main/",
    ]
    var web = webs[Math.floor(Math.random() * webs.length)]

    window.open(web, '_blank');
  }

}

//随机事件
class Card_Event extends Card {
  init(){
    super.init()
    this.usage_status=3
    this.isRandom=true
    this.renergy = Math.floor(Math.random()*11)-5
    this.rmood = Math.floor(Math.random()*11)-5
    this.rmoney = Math.floor(Math.random()*11)-5
    this.rknowledge = Math.floor(Math.random()*11)-5

  }
  cardEffect(gm){
    this.usage_status = 2
    this.isRandom=false
    return super.cardEffect(gm)
  }
}

// 直播
class Card_Stream extends Card {

}

//发行唱片
class Card_Album extends Card {
  checkAvailable(gm){
    if(!gm.signed){
      return false
    }
    return super.checkAvailable()
  }

  cardEffect(gm){
    if(gm.music_all.length != 0){
      gm.music_found.push(gm.music_all[0])
      gm.music_all.shift()
    }
    return super.cardEffect(gm)
  }
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
  cardEffect(gm){
    gm.signed=true
  }
}

//成为代言人
class Card_Agent extends Card {
  cardEffect(gm){
    gm.isAgent=true
    return super.cardEffect(gm)
  }
}



class Game_Manager {
  endingDay =false
  keepCard = null
  myCards = []
  player = new Player(10, 10, 100, 1000,0)
  audio = new Audio()
  portrait="../static/dz_test.jpeg"

  signed = false
  isAgent = false

  music_mute=false
  music_selected={}
  music_found=[]
  music_list=[]
  music_all=[
    {name:"zood",url:"../static/audio/zood.mp3"},
    {name:"肺痒痒",url:"../static/audio/FYY.mp3"},
  ]

  // 普通卡牌
  card_learn(){return new Card("学知识","丁真努力学习","../static/img/知识学爆2.jpg",[-2,-3],[-1,-2],[0],[-10,-30],[1,2])}
  card_ride(){return new Card("骑小马","丁真骑着小马珍珠到处测其他人的马","../static/img/骑小马.png",[0],[-4])}
  card_sleep(){return new Card("睡大觉","丁真开始睡dajiao","../static/dz_test.jpeg",[3,4],[2,3])}
  card_smoke(){return new Card_Smoke("抽电子烟","丁真开始吞云吐雾","../static/img/电子烟.png",[0],[6],[-1,-2],[-10])}
  card_listen_music(){return new Card_Music("听歌","丁真开始听理塘金曲","../static/img/专辑.jpg",[0],[1])}
  card_play(){return new Card("陪雪豹玩耍","丁真愉快地和动物朋友玩耍","../static/img/雪豹.jpeg",[-1],[1,2])}
  card_phone(){return new Card_Phone("玩手机","丁真使用5G上网, 随机生成一张其他卡牌","../static/img/玩手机.jpg")}
  
  //特殊卡牌
  //多次卡牌
  card_stream (){return new Card("直播","丁真开始练习藏话","../static/img/直播1.png",[-2],[-1],[0],[20])}
  card_album(){return new Card_Album("发行专辑","丁真向着格莱美进发","../static/img/唱歌.jpeg",[-3],[-1],[0],[40])}
  card_event(){return new Card_Event("随机事件","丁真在理塘发生随机事件","../static/img/丁真疑惑.jpg")}
  
  //单次卡牌
  card_speak (){return new Card_Speak("联合国演讲","丁真在粘合国上为动物朋友演讲","../static/img/联合国演讲.png",[-3],[-3],[0],[1000])}
  card_weibo (){return new Card_Weibo("微博之夜","丁真在微博之夜上上下下","../static/img/微博之夜.png",[-3],[-3],[0],[1000])}
  card_musicFestival (){return new Card_MusicFestival("亚洲音乐盛典","","../static/img/音乐盛典.png",[-3],[-3],[0],[1000])}
  card_signRecord (){return new Card_SignRecord("签约唱片公司","理塘王子","../static/dz_test.jpeg")}
  card_agent (){return new Card_Agent("成为锐刻5代言人","丁真向传统派发起挑战, 抽电子烟不再花费金钱","../static/img/锐刻代言人.png")}
  
  normalCards (){return [this.card_phone(),this.card_learn(),this.card_ride(), this.card_sleep(), this.card_smoke(), this.card_listen_music(), this.card_play()]}
  specialCards (){
    var cards = [this.card_stream(),card_event()]
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
    this.endingDay =false
    this.keepCard = null
    this.myCards = []
    this.player = new Player(10, 10, 100, 1000,0)
    this.audio = new Audio()
    this.portrait="../static/dz_test.jpeg"
    this.signed = false
    this.isAgent = false
    this.music_mute=false
    this.music_selected={}
    this.music_found=[]
    this.music_list=[]
    this.music_all=[
      {name:"zood",url:"../static/audio/zood.mp3"},
      {name:"肺痒痒",url:"../static/audio/FYY.mp3"},
    ]
    
    this.newDay()
  }

  newDay(){
    this.endingDay=false
    this.player.actionPoint=this.player.maxActionPoint
    this.days ++ 
    console.log(`第${this.days}天`)
    this.myCards = this.getCards(5)
  }

  
  checkCardAvailable(index) {
    var card = this.myCards[index]
    
    if(card.used && !card.keep ){
      card.usage_status ==3?3: 2
      return false
    }
    else if(this.cardValueCheck(card)){
      card.usage_status==3?3:0
     return true 
    }
    else{
      card.usage_status==3?3:1
      return false
    }
  }

  cardValueCheck(card){
    if(card.keep && card.isStatic)
      return false
    if(card.keep && !card.isStatic)
      return true
    if(this.player.actionPoint<=0)
      return false

    if(card.isRandom)
      return true
    if(this.player.energy + card.renergy<0)
      return false
    if(this.player.mood + card.rmood<0)
      return false
    if(this.player.money + card.rmoney<0)
      return false

    if(!card.checkAvailable(this))
      return false
    
    return true
  }
  
  useCard(index) {
    if(this.myCards[index].used && !this.myCards[index].keep ){
      console.log("卡牌已用过")
      return
    }
    if(!this.checkCardAvailable(index)){
      this.myCards[index].usage_status = 1
      console.log("卡牌不可用")
      return
    }
    if(!this.myCards[index].keep)
      this.player.actionPoint --
    var c = this.myCards[index].use(this)
    if(c!=null){
      this.myCards[index] = c
    }
    else{
      this.myCards[index].used = true
    }
    console.log(this.myCards)
  }

  getCards(nums){
    var cards = []
    if(this.myCards[0] == null || this.myCards[0].used){
      var c =this.card_learn()
      c.isStatic = true
      cards = [c]
    }
    else{
      this.myCards[0].keep = false
      cards = [this.myCards[0]]
    }

    for (let i = 0; i < nums; i++) {
      var ncards = this.normalCards()
      var randomIndex = Math.floor(Math.random() * ncards.length);
      cards.push(ncards[randomIndex])
    }
    return cards
  }

  getSpecialCard(){
    var cards = this.specialCards()
    var randomIndex = Math.floor(Math.random() * (cards.length + this.specialCardsOnce.length));
    console.log(randomIndex,this.specialCardsOnce.length)
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
    if(this.endingDay){
      this.keepCard=null
      this.newDay()
      return
    }
    var leftCards = this.myCards.filter(c=>!c.used)
    
    if(leftCards.length == 0)
    {
      this.keepCard = null
      this.newDay()
      return true
    }
    else if(leftCards.length == 1)
    {
      this.keepCard = leftCards[0]
      this.newDay()
      return true
    }
    
    if(this.player.actionPoint>0){
      this.portrait = "../static/img/大力王.gif"
    }
    else{
      this.portrait = "../static/dz_test.jpeg"
    }

    leftCards.forEach(c => {
      c.keep=true
    });
    console.log("leftCards", leftCards)
    this.endingDay= true
    return false
  }

  playAudio(url){
    this.audio.src = url
    this.audio.load()
    this.audio.play()
  
  }

  stopPlayAudio(){
    this.audio.pause()
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

