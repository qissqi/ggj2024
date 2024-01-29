class Util {
  static get_random_int(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  static get_random_item(lst) {
    return lst[Util.get_random_int(0, lst.length - 1)];
  }
}

class Card {
  /* 所有卡的基类
  */
  constructor() {
    this.name = "card base";
    this.img_url = "";
    this.effect = {
      knowledge: null, /* null 表示不确定的数值（在做数值计算时 null 会隐式类型转换成 0） */
      mood:      null,
      energy:    null,
      money:     null,
      health:    null,
    };
    this.description = "";
    this.status = {
      usage: {
        is_usable : true, /* 应保证：如果 is_used 是 ture，is_usable 一定是 false */
        is_used   : false,
      },
      random: {
        is_random        : false, /* 本卡是随机卡（只有随机卡的构造函数中赋值 true） */
        is_from_random   : false, /* 本卡是随机卡生成的卡（在随机卡的 use_event() 中，会给生成的卡的该属性赋值 true） */
        can_be_force_use : true   /* 如果随机卡生成本卡则强制执行 use_event() */
      }
    }
  }

  /* 这是之前的设计
  static USAGE_STATUS = {
    usable           : 0b00001, // 判断用与，赋一用或，置零与非
    used             : 0b00010,
    random           : 0b00100,
    is_from_random   : 0b01000,
    can_be_force_use : 0b10000,
  }
  */

  /* 虚函数，创建卡后，执行回调 */
  create_event(player) { }

  /* 虚函数，使用卡时，执行回调（要求返回文本，以示生效的结果） */
  use_event(player) { return this.description; }

  /* 虚函数，每回合开始前，和每次用卡后，执行回调 */
  update_event(player) { }
}

class Card_Learn extends Card {
  /* 学习卡可以增加知识的卡，是通关游戏的关键卡牌
     学习是很累的，非常耗费心神和体力，还要消耗金钱购买学习资料
  */
  constructor() {
    super();
    this.name = "学知识";
    this.img_url = "../static/img/知识学爆2.jpg";
    this.effect = {
      knowledge: Util.get_random_item([1, 1, 1, 2, 3]),
      mood:      Util.get_random_item([-7, -6, -6, -6, -6, -5, -4, -4, -3]),
      energy:    Util.get_random_item([-7, -6, -6, -6, -6, -5, -4, -3]),
      money:     Util.get_random_item([-5, -5, -5, -4, -4, -4, -4, -3]),
      health:    0,
    };
    this.description = "万般皆下品，唯有读书高";
  }

  use_event(player) {
    player.last_learning = player.round_count;
    return this.description;
  };
}

class Card_Random_Learn extends Card {
  /* 随机学点东西，可能学不进什么东西
    （知识值到达一定高度后解锁）
  */
  constructor() {
    super();
    this.name = "学知识";
    this.img_url = "../static/img/知识学爆2.jpg";
    this.effect = {
      knowledge: null,
      mood:      Util.get_random_item([-2, -1, -1, -1]),
      energy:    Util.get_random_item([-2, -1, -1, -1]),
      money:     Util.get_random_item([-2, -1, -1, -1]),
      health:    0,
    };
    this.description = "万般皆下品，唯有读书高";
  }

  use_event(player) {
    if (Util.get_random_int(0, 5) <= 1) {
      this.effect.knowledge = Util.get_random_item([1, 1, 1, 1, 2]);

      player.status.knowledge.val += this.effect.knowledge;
      player.last_learning = player.round_count;
      this.description = "学到啦";
    }
    else {
      this.effect.knowledge = 0;
      this.description = "什么也没学到";
    }

    return this.description;
  };
}

class Card_Listen_To_Music extends Card {
  /* 听音乐可以放松身心，让心情变得舒畅，也可能会恢复体力哦
     要消耗金钱购买音乐
  */
  constructor() {
    super();
    this.name = "听音乐";
    this.img_url = "../static/img/专辑.jpg";
    this.effect = {
      knowledge: 0,
      mood:      Util.get_random_item([2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4]),
      energy:    Util.get_random_item([0, 1, 2]),
      money:     Util.get_random_int(-3, -1),
      health:    0,
    };
    this.description = "欣赏音乐，放松心情";
  }
}

class Card_Play_Phone extends Card {
  /* 网上冲浪可能让心情变得舒畅，可能恢复体力
     网络世界的新鲜事物很多，可能会有新机遇找上门来哦
  */
  constructor() {
    super();
    this.name = "网上冲浪";
    this.img_url = "../static/img/玩手机.jpg";
    this.effect = {
      knowledge: 0,
      mood:      null,
      energy:    null,
      money:     Util.get_random_item([-2, -2, -1, -1]),
      health:    0,
    };
    this.description = "5G上网，放松心情";
  }

  use_event(player) {
    this.effect.mood   = Util.get_random_item([-2, -1, 0, 1, 1, 2, 3]);
    this.effect.energy = Util.get_random_item([-2, -1, 0, 1, 1, 2, 3]);

    player.status.mood.add(this.effect.mood)
    player.status.energy.add(this.effect.energy);

    if (this.effect.mood > 0 && this.effect.energy >= 0) {
      this.description = "玩手机真开心";
    }
    else if (this.effect.energy < 0) {
      this.description = "玩累了";
    }
    else {
      this.description = "呃...";
    }

    return this.description;
  }
}

class Card_Sleep extends Card {
  /* 睡大觉真的是太舒服啦，睡饱后身体将充满能量，有益健康
  */
  constructor() {
    super();
    this.name = "睡大觉";
    this.img_url = "../static/dz_test.jpeg";
    this.effect = {
      knowledge: 0,
      mood:      Util.get_random_item([0, 0, 0, 0, 0, 0, 1, 2]),
      energy:    Util.get_random_item([2, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 5]),
      money:     0,
      health:    Util.get_random_int(0, 10) == 0 ? 1 : 0,
    };
    this.description = "软绵绵的床好舒服";
  }

  use_event(player) {
    debugger
    /* 在（卡片生效前）体力值较低时，回合的首要行动是睡觉，小概率会花费两天的时间恢复所有体力 */
    if (   player.action_count.val == player.action_count.max - 1
        && player.status.energy.val - this.effect.energy <= Util.get_random_item([0, 1, 1, 2])
        && Util.get_random_int(0, 1) == 0
    ) {
      this.effect.energy = player.status.energy.max;
      this.description = "因为太累睡昏过去了，睡了两天睡饱啦";
      player.status.energy.val = player.status.energy.max;
      player.action_count.val  = 0;
      player.round_count      -= 1;
    }

    return this.description;
  }
}

class Card_Smoke extends Card {
  /* 抽电子烟可以排解心中的苦闷，但是抽烟得到的身心愉悦是要付出健康代价的
     需要花费金钱购买电子烟
  */
  constructor() {
    super();
    this.name = "抽电子烟";
    this.img_url = "../static/img/电子烟.png";
    this.effect = {
      knowledge: 0,
      mood:      Util.get_random_item([3, 4, 4, 5, 5, 6, 6, 6, 7]),
      energy:    Util.get_random_item([3, 4, 4, 5, 5, 6, 6, 6, 7]),
      money:     Util.get_random_int(-30, -15),
      health:    Util.get_random_item([-5, -5, -5, -5, -4, -4, -4, -4, -4, -3]),
    };
    this.description = "芜湖芜湖真的好满足";
    this.status.random.can_be_force_use = false;
  }

  create_event(player) {
    if (player.achievement.is_RELX_V_brand_ambassador) {
      /* 品牌大使的优惠 */
      this.effect.money = Math.trunc(this.effect.money / 3 * 2);
    }
  }
}

class Card_Play_With_Snow_Leopard extends Card {
  /* 和喜爱的动物朋友们玩耍，可能会有点累，但嘻嘻哈哈真开心，
     多和大自然拥抱有益健康哦
  */
  constructor() {
    super();
    this.name = "陪雪豹玩耍";
    this.img_url = "../static/img/雪豹.jpeg";
    this.effect = {
      knowledge: 0,
      mood:      Util.get_random_item([1, 1, 1, 1, 2, 2, 3]),
      energy:    Util.get_random_item([-2, -1, -1, 0, 0, 0]),
      money:     0,
      health:    Util.get_random_int(0, 5) == 0 ? 1 : 0,
    };
    this.description = "芝士雪豹，我的动物朋友";
  }
}

class Card_Riding extends Card {
  /* 骑上我的小马，走出大山新游戏
     骑马运动可能会有点累，但有益身心健康哦
  */
  constructor() {
    super();
    this.name = "骑小马";
    this.img_url = "../static/img/骑小马.png";
    this.effect = {
      knowledge: 0,
      mood:      Util.get_random_item([1, 1, 1, 1, 1, 1, 2, 3]),
      energy:    Util.get_random_item([-2, -1, -1, 0, 0, 0]),
      money:     0,
      health:    Util.get_random_int(0, 5) == 0 ? 1 : 0,
    };
    this.description = "我的小马比赛拿过第一";
  }

  use_event(player) {
    if (Util.get_random_int(0, 6) <= 1) {
      this.effect.money = Util.get_random_int(1, 8);
      this.description = "骑着小马外出，幸运地捡到了金币";

      player.status.money.add(this.effect.money);
    }
    return this.description;
  }
}

class Card_Random_Event extends Card {
  /* 执行随机事件
  */
  constructor() {
    debugger
    super();
    this.name = "？";
    this.img_url = "../static/img/问号.png";
    this.effect = {
      knowledge: null,
      mood:      null,
      energy:    null,
      money:     null,
      health:    null,
    };
    this.description = "？";
    this.status.random.is_random = true;
  }

  use_event(player) {
    let self_idx = player.card_group.findIndex(card => card === this);
    let new_card = (Util.get_random_int(0, 6) <= 1)
        ? Card_Factory.get_special_card() /* 有一定概率变为特殊卡，触发特殊事件 */
        : Card_Factory.get_random_card();

    new_card.status.random.is_from_random = true;
    player.card_group[self_idx] = new_card;

    if (new_card.status.random.can_be_force_use) {
      return player.force_use_card(new_card).txt;
    }
    else {
      return `获得[${new_card.name}]`;
    }
  }
}

class Card_Learn_A_Lot extends Card {
  /* 知识学爆卡可以让你轻松学到知识，真的非常轻松
  */
  constructor() {
    super();
    this.name = "知识学爆";
    this.img_url = "../static/img/知识学爆1.png";
    this.effect = {
      knowledge: Util.get_random_item([1, 1, 1, 1, 1, 1, 1, 1, 2, 3]),
      mood:      0,
      energy:    0,
      money:     0,
      health:    0,
    };
    this.description = "轻轻松松学到了知识";
  }

  use_event(player) {
    player.last_learning = player.round_count;
    return this.description;
  }
}

class Card_Learned_Live extends Card {
  /* 学会了网络直播
  */
  constructor() {
    super();
    this.name = "学会网络直播";
    this.img_url = "../static/img/直播2.png";
    this.effect = {
      knowledge: 0,
      mood:      Util.get_random_item([0, 0, 0, 1]),
      energy:    0,
      money:     0,
      health:    0,
    };
    this.description = "以后可以开直播赚大钱咯";
  }

  use_event(player) {
    Card_Factory.remove_special_card_class(Card_Learned_Live);
    Card_Factory.add_normal_card_class(Card_Live); /* 之后可以网络直播 */

    return this.description;
  }
}

class Card_Live extends Card {
  /* 网络直播可以轻松赚大钱捏
  */
  constructor() {
    super();
    this.name = "网络直播";
    this.img_url = "../static/img/直播2.png";
    this.effect = {
      knowledge: Util.get_random_item([-1, 0, 0, 0, 0, 0, 0, 0, 0, 1]),
      mood:      Util.get_random_item([-1, 0, 0, 0, 1]),
      energy:    Util.get_random_item([-1, -1, -1, 0, 0, 0, 0, 0, 0, 0]),
      money:     Util.get_random_int(4, 12),
      health:    0,
    };
    this.description = "开直播赚大钱";
  }
}

class Card_Be_RELX_V_Brand_Ambassador extends Card {
  /* 成为品牌代言人，享有更多优惠，爽歪歪
  */
  constructor() {
    super();
    this.name = "代言 RELX V";
    this.img_url = "../static/img/代言.png";
    this.effect = {
      knowledge: 0,
      mood:      Util.get_random_int(0, 3),
      energy:    0,
      money:     Util.get_random_int(10, 30),
      health:    0,
    };
    this.description = "花更少钱抽电子烟";
  }

  use_event(player) {
    Card_Factory.remove_special_card_class(Card_Be_RELX_V_Brand_Ambassador);

    player.achievement.is_RELX_V_brand_ambassador = true;

    return this.description;
  }
}

class Card_Be_Musician extends Card {
  /* 成为音乐人，之后可以发辑专赚大钱
  */
  constructor() {
    super();
    this.name = "成为音乐人";
    this.img_url = "../static/img/高歌.png";
    this.effect = {
      knowledge: 0,
      mood:      Util.get_random_int(0, 3),
      energy:    0,
      money:     Util.get_random_int(10, 30),
      health:    0,
    };
    this.description = "签约音乐公司后可以发行专辑";
  }
  
  use_event(player) {
    Card_Factory.remove_special_card_class(Card_Be_Musician);
    Card_Factory.add_normal_card_class(Card_Album); /* 之后可以发行专辑 */

    player.achievement.is_musician = true;

    return this.description;
  }
}

class Card_Album extends Card {
  /* 发专辑赚大钱
  */
  constructor() {
    super();
    this.name = "发布专辑";
    this.img_url = "../static/img/高歌.png";
    this.effect = {
      knowledge: 0,
      mood:      Util.get_random_item([-1, 0, 0, 0, 1]),
      energy:    Util.get_random_item([-1, -1, -1, 0, 0, 0, 0, 0]),
      money:     Util.get_random_int(4, 12),
      health:    0,
    };
    this.description = "发专辑赚大钱";
  }
}

class Card_Identify_True extends Card {
  /* 一眼丁真，鉴定为真，赚点小钱
     （知识值到达一定高度后解锁）
  */
  constructor() {
    super();
    this.name = "鉴定为真";
    this.img_url = "../static/img/鉴定师.png";
    this.effect = {
      knowledge: 0,
      mood:      Util.get_random_item([-2, -2, -1, -1, 0]),
      energy:    Util.get_random_item([-2, -2, -1, -1, 0]),
      money:     Util.get_random_int(2, 9),
      health:    0,
    };
    this.description = "一眼丁真，鉴定为真";
  }
}

class Card_Botanist extends Card {
  /* 很神奇吧，卡的名字和功能一定关系都没有 */
  constructor() {
    super();
    this.name = "绎演";
    this.img_url = "../static/img/植物学家.png";
    this.effect = {
      knowledge: 0,
      mood:      null,
      energy:    null,
      money:     Util.get_random_int(-6, -4),
      health:    0,
    };
    this.description = "互换心情值和体力值";
    this.status.random.can_be_force_use = false;
  }

  use_event(player) {
    /* 每过一回合，本卡价格都会涨一点 */
    this.effect.money += Util.get_random_item([-4, -3, -2, -2]);

    /* 互换心情值和体力值 
      （使用 add 可以防止值溢出，虽然设计上心情值和体力值的上限是一样） */
    let mood_val   = player.status.mood  .val;
    let energy_val = player.status.energy.val;
    player.status.mood  .val = 0;
    player.status.energy.val = 0;
    player.status.mood  .add(energy_val);
    player.status.energy.add(mood_val);
    return "互换心情值和体力值";
  }

  update_event(player) {
    /* 每一次行动，不管出什么卡，本卡价格都会涨一点 */
    this.effect.money += Util.get_random_item([-2, -1, -1]);

    /* 恢复使用情况 */
    this.status.usage.is_used = false;
  }
}

class Card_Speech extends Card {
  /* 做演讲，赚大钱
  */
  constructor() {
    super();
    this.name = "演讲";
    this.img_url = "../static/img/联合国演讲.png";
    this.effect = {
      knowledge: 0,
      mood:      Util.get_random_item([0, 0, 1, 1, 2]),
      energy:    Util.get_random_int(-1, 0),
      money:     Util.get_random_int(20, 60),
      health:    0,
    };
    this.description = "《我和我的高原朋友》";
  }
}

class Card_Factory {
  static normal_card_class_list  = [];
  static random_card_class_list  = [];
  static special_card_class_list = [];

  static reset() {
    /* 普通卡 */
    Card_Factory.normal_card_class_list = [
      Card_Listen_To_Music,
      Card_Play_Phone,
      Card_Sleep,
      Card_Smoke,
      Card_Play_With_Snow_Leopard,
      Card_Riding,
      Card_Random_Event,
      /* Card_Live, 随机卡开出特殊事件卡 Card_Learned_Live 后解锁 */
      /* Card_Album, 随机卡开出特殊事件卡 Card_Be_Musician 后解锁 */
      /* Card_Identify_True, 知识到达一定水平后解锁 */
      /* Card_Random_Learn,  知识到达一定水平后解锁 */
    ];

    /* 随机卡（由随机事件卡开出） */
    Card_Factory.random_card_class_list = [
      Card_Listen_To_Music,
      Card_Play_Phone,
      Card_Sleep,
      Card_Play_With_Snow_Leopard,
      Card_Riding,
      Card_Smoke,
    ];

    /* 特殊卡（由随机事件卡开出） */
    Card_Factory.special_card_class_list = [
      Card_Learn_A_Lot,
      Card_Botanist,
      Card_Speech,

      /* 以下卡只触发一次（触发后移除） */
      Card_Be_RELX_V_Brand_Ambassador,
      Card_Be_Musician,
      Card_Learned_Live,
    ];
  }

  /* 获取学习卡 */
  static get_learn_card() {
    return new Card_Learn();
  }

  /* 获取一张普通卡 */
  static get_card() {
    return new (Util.get_random_item(Card_Factory.normal_card_class_list))();
  }

  /* 获取一张随机卡 */
  static get_random_card() {
    return new (Util.get_random_item(Card_Factory.random_card_class_list))();
  }

  /* 获取一张特殊卡 */
  static get_special_card() {
    return new (Util.get_random_item(Card_Factory.special_card_class_list))();
  }

  /* 添加普通卡 */
  static add_normal_card_class(card_class) {
    Card_Factory.normal_card_class_list.push(card_class);
  }
  
  /* 移除普通卡 */
  static remove_normal_card_class(card_class) {
    Card_Factory.normal_card_class_list = Card_Factory.normal_card_class_list.filter(
      item => item !== card_class
    );
  }

  /* 添加特殊卡 */
  static add_special_card_class(card_class) {
    Card_Factory.special_card_class_list.push(card_class);
  }

  /* 移除特殊卡 */
  static remove_special_card_class(card_class) {
    Card_Factory.special_card_class_list = Card_Factory.special_card_class_list.filter(
      item => item !== card_class
    );
  }
}

class ValTxt {
  /* 用作携带文本信息的返回值类型 */
  constructor(val, txt="") {
    this.val = val;
    this.txt = txt;
  }
}

class Player {
  constructor() {
    this.reset();
  }

  /* 重置，开始新的一局 */
  reset() {
    let status_val_add = (status, to_add) => {
      status.val = Math.max(0, Math.min(status.max, status.val + to_add));
    }

    /* 重置状态 */
    this.round_count  = 100;
    this.action_count = { val: 4, max: 4 };
    this.card_group   = [];
    this.game_outcome = {
      is_over   : false,
      is_winner : false,
      text      : "",
    }
    this.status = {
      last_learning: this.round_count,
      knowledge : { val:  0, max: 100, add: (v) => {status_val_add(this.status.knowledge, v)}},
      mood      : { val: 10, max: 20 , add: (v) => {status_val_add(this.status.mood     , v)}},
      energy    : { val: 10, max: 20 , add: (v) => {status_val_add(this.status.energy   , v)}},
      money     : { val: 80, max: 500, add: (v) => {status_val_add(this.status.money    , v)}},
      health    : { val: 25, max: 30 , add: (v) => {status_val_add(this.status.health   , v)}},
    }
    this.achievement = {
      is_RELX_V_brand_ambassador : false,
      is_musician                : false,
      is_appraiser               : false,
    }

    /* 重置卡组 */
    Card_Factory.reset();
    this.card_group.push(Card_Factory.get_learn_card());
    this.card_group.push(Card_Factory.get_card());
    this.card_group.push(Card_Factory.get_card());
    this.card_group.push(Card_Factory.get_card());
    this.card_group.push(Card_Factory.get_card());
    this.card_group.push(Card_Factory.get_card());
    for (let i = 0; i < this.card_group.length; i++) {
      this.card_group[i].create_event(this);
    }
    this.update_card_usage_status();
  }

  /* 用于更新卡状态（每次用卡后调用）*/
  update_card_usage_status() {

    /* 先执行回调，先 */
    for (let i = 0; i < this.card_group.length; i++) {
      this.card_group[i].update_event(this);
    }

    /* 更新没有使用过的卡的状态 */
    for (let i = 0; i < this.card_group.length; i++) {
      let card = this.card_group[i];
      if ( ! card.status.usage.is_used) {
        card.status.usage.is_usable = this.is_card_usable(card).val;
      }
    }
  }

  /* 判断卡是否可用（用卡前调用） return ValTxt(bool, ) */
  is_card_usable(card) {
    if (this.action_count.val <= 0)                      return new ValTxt(false, "行动数耗尽");
    if (card.status.usage.is_used)                       return new ValTxt(false, "此卡已被使用过");
    if (this.status.mood  .val + card.effect.mood   < 0) return new ValTxt(false, "当前心情值不足");
    if (this.status.energy.val + card.effect.energy < 0) return new ValTxt(false, "当前体力值不足");
    if (this.status.money .val + card.effect.money  < 0) return new ValTxt(false, "当前资产值不足");
    return new ValTxt(true);
  }

  /* 用卡 return ValTxt(bool, ) */
  use_card(idx) {
    /* 判断游戏结束 */
    if (this.is_game_over()) {
      return new ValTxt(false, this.game_outcome.text);
    }

    /* 检测卡是否可用 */
    let card = this.card_group[idx];
    let res  = this.is_card_usable(card);
    if ( ! res.val) {
      return new ValTxt(false, res.txt);
    }

    /* 卡生效 */
    this.status.knowledge.add(card.effect.knowledge);
    this.status.mood     .add(card.effect.mood     );
    this.status.energy   .add(card.effect.energy   );
    this.status.money    .add(card.effect.money    );
    this.status.health   .add(card.effect.health   );

    /* 扣除行动数 */
    this.action_count.val -= 1;

    /* 卡牌发挥特殊效果（在扣除行动数后执行，因为卡的效果有可能与行动数有关） */
    let result_text = card.use_event(this);

    /* 更新卡的状态（一定要在调用 use_event() 后执行 */
    if ( ! card.status.random.is_random) {
      card.status.usage.is_used   = true;
      card.status.usage.is_usable = false;
    }
    else {
      card = this.card_group[idx]; /* 执行随机卡的 use_event() 后会生成新卡，需重新取引用 */
      if (card.status.random.can_be_force_use) {
        card.status.usage.is_used   = true;
        card.status.usage.is_usable = false;
      }
    }
    this.update_card_usage_status();

    /* 判断游戏结束（在扣除行动数后执行，因为判断结局与行动数有关） */
    this.judge_game_over_after_card();
    if (this.action_count.val == 0) {
      this.judge_game_over_before_next();
    }

    return new ValTxt(true, result_text);
  }

  /* 强制用卡 return ValTxt( true , )
     只能由特殊卡的 use_event() 调用
     调用关系：use_card() -> random_event_card.use_event() -> force_use_card(another_card)
  */
  force_use_card(card) {
    /* 不判断游戏结束 */

    /* 不检测卡是否可用，不管是不是可用都强行使用 */

    /* 卡生效 */
    this.status.knowledge.add(card.effect.knowledge);
    this.status.mood     .add(card.effect.mood     );
    this.status.energy   .add(card.effect.energy   );
    this.status.money    .add(card.effect.money    );
    this.status.health   .add(card.effect.health   );

    /* 不扣除行动数 */

    /* 卡牌发挥特殊效果 */
    let result_text = card.use_event(this);

    /* 不需要更新卡的状态，此函数结束后将会由 use_card() 更新 */
    
    /* 不需要判断游戏结束，此函数结束后将会由 use_card() 判断 */

    return new ValTxt(true, result_text);
  }

  /* 开启下一回合（可选一张未使用过的卡以保留） return ValTxt(bool, ) */
  next_round(keep_card_idx=null) {
    /* 下一回合前，先判断游戏是否结束（这里也要判断是因为，有可能本回合没出过卡就跳下一回合） */
    if (true == this.judge_game_over_before_next()) {
      return new ValTxt(false, this.game_outcome.text);
    }

    /* 判断保留卡 */
    if (null != keep_card_idx) {
      if (0 == keep_card_idx) {
        return new ValTxt(false, "无须继承固定的学习卡");
      }
      else if (this.card_group[keep_card_idx].status.usage.is_used) {
        return new ValTxt(false, "无法继承已使用过的卡");
      }
    }

    /* 如果行动数未耗尽就结束本回合，会随机减少心情和体力以示惩罚 */
    let random_punishment = { knowledge: 0, mood: 0, energy: 0 }
    if (this.action_count.val == 1) {
      random_punishment.mood   = Util.get_random_item([-1, -1, 0, 0, 0]);
      random_punishment.energy = Util.get_random_item([-1, -1, 0, 0, 0]);
    }
    else if (this.action_count.val > 1) {
      random_punishment.mood   = Util.get_random_item([-2, -1, -1, 0, 0]);
      random_punishment.energy = Util.get_random_item([-1, -1, -1, 0, 0]);
    }
    /* 如果太久不学习，会随机减少知识以示惩罚 */
    if (this.last_learning - this.round_count >= Util.get_random_item([3, 4, 4, 4, 5])) {
      random_punishment.knowledge = Util.get_random_item([-2, -1, -1, -1, -1, 0, 0, 0]);
    }

    /* 实行惩罚 */
    this.status.knowledge.add(random_punishment.knowledge);
    this.status.mood     .add(random_punishment.mood     );
    this.status.energy   .add(random_punishment.energy   );

    /* 更新状态 */
    this.action_count.val = this.action_count.max;
    this.round_count -= 1;

    /* 增删卡池中的卡，知识到了一定水平后解锁 */
    if ( ! this.achievement.is_appraiser) { if (this.status.knowledge.val >= 5) {
        this.achievement.is_appraiser = true;
        Card_Factory.add_normal_card_class(Card_Identify_True);
        Card_Factory.add_normal_card_class(Card_Random_Learn); /* 本来设计只加鉴定卡，现在多加一个随机学习卡 */
      }
    } else { if (this.status.knowledge.val < 5) {
        this.achievement.is_appraiser = false;
        Card_Factory.remove_normal_card_class(Card_Identify_True);
        Card_Factory.remove_normal_card_class(Card_Random_Learn);
      }
    }

    /* 创建卡 */
    if (this.card_group[0].status.usage.is_usable) {
      this.card_group[0] = Card_Factory.get_learn_card();
    }
    for (let i = 1; i < this.card_group.length; i++) {
      if (keep_card_idx != i) {
        this.card_group[i] = Card_Factory.get_card();
      }
    }
    if (this.card_group[0].status.usage.is_usable) {
      this.card_group[0].create_event(this);
    }
    for (let i = 1; i < this.card_group.length; i++) {
      if (keep_card_idx != i) {
        this.card_group[i].create_event(this);
      }
    }

    /* 更新状态 */
    this.update_card_usage_status();

    let return_text = "新的一天开始了，今天要好好努力" +
      (random_punishment.knowledge < 0 ? "\n太久没学习了，感觉脑袋变空空" : "") +
      (random_punishment.mood      < 0 ? "\n昨天没有足够努力，今天心情变差了" : "") + 
      (random_punishment.energy    < 0 ? "\n昨天没有足够努力，今天也变得没什么动力呢" : "");

    return new ValTxt(true, return_text);
  }

  /* 判断游戏是否已经结束 return bool */
  is_game_over() {
    return this.game_outcome.is_over;
  }

  /* 设置游戏结局 */
  set_game_outcome = (is_winner, text) => {
    this.game_outcome = {
      is_over   : true,
      is_winner : is_winner,
      text      : `游戏结束 [${is_winner ? '胜利' : '失败'}] ${text}`,
    }
  }

  /* 判断游戏是否结束（仅用于出卡后的判断） */
  judge_game_over_after_card() {
    if (this.is_game_over()) {
      return true;
    }

    if (this.status.knowledge.val >= this.status.knowledge.max) {
      this.set_game_outcome(true, "知识学爆");
      return true;
    }
    else if (this.status.money.val >= this.status.money.max) {
      this.set_game_outcome(true, "爆金币咯");
      return true;
    }
    else if (this.status.health.val <= 0) {
      this.set_game_outcome(false, "吸烟过多，耗尽健康值");
      return true;
    }

    return false;
  }

  /* 判断游戏是否结束（仅用于开启下一轮前的判断） */
  judge_game_over_before_next() {
    if (this.is_game_over()) {
      return true;
    }

    if (this.status.energy.val + this.status.mood.val <= 3) {
      this.set_game_outcome(false, "身心俱疲");
      return true;
    }
    else if (this.status.energy.val == 0) {
      this.set_game_outcome(false, "体力不支");
      return true;
    }
    else if (this.status.mood.val == 0) {
      this.set_game_outcome(false, "心情抑郁");
      return true;
    }
    else if (this.status.money.val <= 3) {
      this.set_game_outcome(false, "穷困潦倒");
      return true;
    }
    else if (this.action_count <= 0) {
      this.set_game_outcome(false, "时间耗尽");
      return true;
    }

    return false;
  }
}
