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
      knowledge: 0,
      mood:      0,
      energy:    0,
      money:     0,
      health:    0
    };
    this.description   = "";
    this.usage_status  = Card.USAGE_STATUS.usable;
  }

  /* 判断用与，赋一用或，置零与非 */
  static USAGE_STATUS = {
    usable:   0b001,
    used:     0b010,
    random:   0b100,
  }

  /* 虚函数， */
  update_event(player) { }

  /* 虚函数，使用卡牌后执行的回调（要求返回文本，以示生效的结果） */
  use_event(player) { return this.description; }
}

class Card_Learn extends Card {
  /* 学习卡唯一可以增加知识的卡，是通关游戏的关键卡牌
     学习是很累的，可能会耗费心神，可能会消耗体力
     可能要消耗一部分金钱购买学习资料
  */
  constructor() {
    super();
    this.name = "知识学爆";
    this.img_url = "../static/img/知识学爆2.jpg";
    this.effect = {
      knowledge: Util.get_random_item([1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3]),
      mood:      Util.get_random_item([-5, -5, -4, -4, -3, -3, -2, -1, 0, 1]),
      energy:    Util.get_random_item([-5, -5, -4, -4, -3, -3, -2, -2, -1, 0]),
      money:     Util.get_random_item([-5, -4, -3, -3, -2, -2, -1, -1, 0]),
      health:    0,
    };
    this.description = "万般皆下品，唯有读书高";
  }
}

class Card_Listen_To_Music extends Card {
  /* 听音乐可以放松身心，让心情变得舒畅，也可能会恢复体力哦
     要消耗一部分金钱购买音乐
  */
  constructor() {
    super();
    this.name = "听音乐";
    this.img_url = "../static/img/专辑.jpg";
    this.effect = {
      knowledge: 0,
      mood:      Util.get_random_item([1, 1, 1, 1, 1, 1, 2, 2, 2, 3]),
      energy:    Util.get_random_item([0, 0, 0, 1, 1]),
      money:     Util.get_random_item([-3, -2, -2, -2, -2, -1, -1, -1, -1]),
      health:    0,
    };
    this.description = "欣赏音乐，放松心情";
  }

  use_event(player) {
    /* 在这里调用音乐播放器 */
  };
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
      mood:      Util.get_random_item([1, 1, 1, 1, 1, 1, 1, 1, 1, 2]),
      energy:    Util.get_random_item([0, 0, 0, 0, 0, 0, 0, 1]),
      money:     Util.get_random_int(-5, 0),
      health:    0,
    };
    this.description = "5G上网，放松心情";
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
      mood:      Util.get_random_item([0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2]),
      energy:    Util.get_random_item([1, 2, 2, 2, 2, 3, 3, 3, 4, 4, 4]),
      money:     0,
      health:    Util.get_random_item([0, 0, 0, 0, 0, 0, 1]),
    };
    this.description = "软绵绵的床好舒服";
  }

  use_event(player) {
    /* 在体力值较低时，如果首要行动是睡觉，有概率花费一整天的时间恢复所有体力 */
    if (   player.status.energy.val <= player.status.energy.max / 4
        && player.action_count.val >= player.action_count.max - 1
        && Util.get_random_int(0, 8) > 0
    ) {
      player.status.energy.val = player.status.energy.max;
      player.action_count.val = 0;
      return "因为太累睡昏过去了，睡了一整天，现在睡饱啦";
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
      mood:      Util.get_random_item([0, 1, 2, 2, 2, 3, 3, 3, 4, 4, 5]),
      energy:    Util.get_random_item([0, 1, 2, 2, 2, 3, 3, 3, 4, 4]),
      money:     Util.get_random_int(-18, -6),
      health:    Util.get_random_item([-5, -5, -4, -4, , -3, -3, -2, -2, -1]),
    };
    this.description = "芜湖芜湖真的好满足";
  }

  update_event(player) {
    if (player.achievement.is_RELX_V_brand_ambassador) {
      /* 品牌大使的优惠 */
      this.effect.money = Math.trunc(this.effect.money / 2);
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
      mood:      Util.get_random_item([1, 2, 2, 2]),
      energy:    Util.get_random_int(-2, 2),
      money:     0,
      health:    Util.get_random_item([0, 0, 0, 0, 0, 0, 0, 1]),
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
      mood:      Util.get_random_item([1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3]),
      energy:    Util.get_random_item([-1, 0, 0, 0, 0, 0, 1, 1, 1, 1]),
      money:     0,
      health:    Util.get_random_item([0, 0, 0, 0, 0, 0, 0, 1]),
    };
    this.description = "我的小马比赛拿过第一";
  }
}

class Card_Random_Event extends Card {
  /* 执行随机事件，可能是好事，也可能是坏事
  */
  constructor() {
    super();
    this.name = "随机事件";
    this.img_url = "../static/img/问号.png";
    this.effect = {
      knowledge: 0,
      mood:      0,
      energy:    0,
      money:     0,
      health:    0,
    };
    this.description = "触发随机事件";
    this.usage_status |= Card.USAGE_STATUS.random;
  }

  use_event(player) {
    let self_idx = player.card_group.findIndex(card => card === this);
    let new_card = (Util.get_random_int(0, 8) > 0)
        ? Card_Factory.get_random_card()
        : Card_Factory.get_special_card(); /* 有一定概率变为特殊卡，触发特殊事件 */

    player.card_group[self_idx] = new_card;

    return player.force_use_card(new_card).txt;
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
      money:     Util.get_random_int(0, 20),
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
      money:     Util.get_random_int(0, 20),
      health:    0,
    };
    this.description = "签约音乐公司后可以发行专辑";
  }
  
  use_event(player) {
    Card_Factory.remove_special_card_class(Card_Be_Musician);
    Card_Factory.add_normal_card_class(Card_Album);

    player.achievement.is_musician = true;

    return this.description;
  }
}

class Card_Album extends Card {
  /* 发专辑赚大钱 */
  constructor() {
    super();
    this.name = "发布专辑";
    this.img_url = "../static/img/高歌.png";
    this.effect = {
      knowledge: 0,
      mood:      0,
      energy:    0,
      money:     Util.get_random_int(10, 30),
      health:    0,
    };
    this.description = "发专辑赚大钱";
  }

  use_event(player) {
    Card_Factory.add_normal_card_class(Card_Album);
    Card_Factory.remove_special_card_class(Card_Be_Musician);

    player.achievement.is_musician = true;

    return this.description;
  }
}

class Card_Factory {
  /* 普通卡 */
  static normal_card_class_list = [
    Card_Learn,
    Card_Listen_To_Music,
    Card_Play_Phone,
    Card_Sleep,
    Card_Smoke,
    Card_Play_With_Snow_Leopard,
    Card_Riding,
    Card_Random_Event
  ];

  /* 随机卡（由随机事件卡开出，包含部分普通卡） */
  static random_card_class_list = [
    Card_Learn,
    Card_Listen_To_Music,
    Card_Play_Phone,
    Card_Sleep,
    Card_Play_With_Snow_Leopard,
    Card_Riding,
  ];

  /* 特殊卡（由随机事件卡开出） */
  static special_card_class_list = [
    Card_Be_RELX_V_Brand_Ambassador,
    Card_Be_Musician,
  ];

  /* 获取学习卡 */
  static get_learn_card() {
    return new Card_Learn();
  }

  /* 获取普通卡（用于每回合的生成新卡） */
  static get_card() {
    return new (Util.get_random_item(Card_Factory.normal_card_class_list))();
  }

  /* 获取随机卡 */
  static get_random_card() {
    return new (Util.get_random_item(Card_Factory.random_card_class_list))();
  }
  
  /* 获取特殊卡 */
  static get_special_card() {
    return new (Util.get_random_item(Card_Factory.special_card_class_list))();
  }

  /* 添加普通卡（触发特殊事件后，可能增添新卡） */
  static add_normal_card_class(card_class) {
    Card_Factory.normal_card_class_list.push(card_class);
  }
  
  /* 添加特殊卡（触发特殊事件后，可能增添新卡） */
  static add_special_card_class(card_class) {
    Card_Factory.special_card_class_list.push(card_class);
  }

  /* 移除特殊卡（触发特殊事件后，可能移除卡） */
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
    /* 重置状态 */
    this.status = {
      knowledge : { val:  0, max: 100  },
      mood      : { val: 10, max: 20   },
      energy    : { val: 10, max: 20   },
      money     : { val: 50, max: 300  },
      health    : { val: 50, max: 100  },
    }
    this.achievement = {
      is_RELX_V_brand_ambassador: false,
      is_musician               : false,
    }
    this.round_count   = 150;
    this.action_count  = { val: 4, max: 4 };
    this.card_group    = [];
    this.keep_card_idx = null;
    this.game_outcome  = {
      is_over   : false,
      is_winner : false,
      text      : "",
    }

    /* 重置卡组 */
    this.card_group.push(Card_Factory.get_learn_card());
    this.card_group.push(Card_Factory.get_card());
    this.card_group.push(Card_Factory.get_card());
    this.card_group.push(Card_Factory.get_card());
    this.card_group.push(Card_Factory.get_card());
    this.card_group.push(Card_Factory.get_card());
    this.update_card_usage_status();
  }

  /* 用于更新卡状态（每次用卡后调用）*/
  update_card_usage_status() {
    for (let i = 0; i < this.card_group.length; i++) {
      this.card_group[i].update_event(this);
    }

    for (let i = 0; i < this.card_group.length; i++) {
      let card = this.card_group[i];

      /* 未翻开的随机事件卡，和已用过的卡不更新状态 */
      if (card.usage_status & Card.USAGE_STATUS.random) continue;
      if (card.usage_status & Card.USAGE_STATUS.used)   continue;

      /* 更新没有使用过的卡的状态 */
      if (true == this.is_card_usable(card).val) {
        card.usage_status |= Card.USAGE_STATUS.usable;
      } else {
        card.usage_status &= ~Card.USAGE_STATUS.usable;
      }
    }
  }

  /* 判断卡是否可用（用卡前调用） return ValTxt(bool, ) */
  is_card_usable(card) {
    if (this.action_count.val <= 0)                      return new ValTxt(false, "行动数耗尽");
    if (card.usage_status & Card.USAGE_STATUS.used)      return new ValTxt(false, "此卡已被使用过");
    if (this.status.mood  .val + card.effect.mood   < 0) return new ValTxt(false, "当前心情值不足");
    if (this.status.energy.val + card.effect.energy < 0) return new ValTxt(false, "当前体力值不足");
    if (this.status.money .val + card.effect.money  < 0) return new ValTxt(false, "当前资产值不足");
    return new ValTxt(true);
  }

  /* 用卡 return ValTxt(bool, ) */
  use_card(idx) {
    /* 判断游戏结束 */
    if (this.is_game_over()) {
      return new ValTxt(false, "游戏已结束");
    }

    /* 检测卡是否可用 */
    let card = this.card_group[idx];
    let res  = this.is_card_usable(card);
    if ( ! res.val) {
      return new ValTxt(false, res.txt);
    }

    /* 卡生效 */
    this.status.knowledge.val += card.effect.knowledge;
    this.status.mood     .val += card.effect.mood;
    this.status.energy   .val += card.effect.energy;
    this.status.money    .val += card.effect.money;
    this.status.health   .val += card.effect.health;

    /* 确保属性数值不越界 */
    let ensure_in_range = (status) => {
      if (status.max < status.val) status.val = status.max;
      /* 不需要判断 < 0，这由 is_card_usable() 保证 */
    }
    ensure_in_range(this.status.knowledge);
    ensure_in_range(this.status.mood     );
    ensure_in_range(this.status.energy   );
    ensure_in_range(this.status.health   );

    /* 扣除行动数 */
    this.action_count.val -= 1;

    /* 卡牌发挥特殊效果（在扣除行动数后执行，因为卡的效果有可能与行动数有关） */
    let result_text = card.use_event(this);

    /* 更新卡的状态（在调用 use_event() 后执行
      如果本卡是随机卡，那么执行use_event() 后，
      可能会生成新的卡代替卡组中本卡的位置，所以需要重新获取引用） */
    card = this.card_group[idx];
    card.usage_status &= ~Card.USAGE_STATUS.usable;
    card.usage_status |=  Card.USAGE_STATUS.used;
    this.update_card_usage_status();

    /* 判断游戏结束（在扣除行动数后执行，因为判断结局与行动数有关） */
    this.judge_game_over_after_card();

    return new ValTxt(true, result_text);
  }

  /* 强制用卡 return ValTxt( true , )
     只能由特殊卡的 use_event() 调用
     调用关系：use_card(card) -> card.use_event() -> force_use_card(another_card)
  */
  force_use_card(card) {
    /* 不判断游戏结束 */

    /* 不检测卡是否可用，不管是不是可用都强行使用 */

    /* 卡生效 */
    this.status.knowledge.val += card.effect.knowledge;
    this.status.mood     .val += card.effect.mood;
    this.status.energy   .val += card.effect.energy;
    this.status.money    .val += card.effect.money;
    this.status.health   .val += card.effect.health;

    /* 确保属性数值不越界 */
    let ensure_in_range = (status) => {
      if (status.max < status.val) status.val = status.max;
      else if (status.val < 0)     status.val = 0;
    }
    ensure_in_range(this.status.knowledge);
    ensure_in_range(this.status.mood     );
    ensure_in_range(this.status.energy   );
    ensure_in_range(this.status.health   );

    /* 不扣除行动数 */

    /* 卡牌发挥特殊效果 */
    let result_text = card.use_event(this);

    /* 不需要更新卡的状态，此函数结束后将会由 use_card() 更新 */
    
    /* 不需要判断游戏结束，此函数结束后将会由 use_card() 判断 */

    return new ValTxt(true, result_text);
  }

  /* 开启下一回合（可选一张未使用过的卡以保留） return ValTxt(bool, ) */
  next_round(keep_card_idx=null) {
    if (this.is_game_over()) {
      return new ValTxt(false, "游戏结束");
    }

    if (null != keep_card_idx) {
      if (0 == keep_card_idx) {
        return new ValTxt(false, "无须继承固定的学习卡");
      }
      else if (this.card_group[keep_card_idx].usage_status & Card.USAGE_STATUS.used) {
        return new ValTxt(false, "无法继承已使用过的卡");
      }
    }

    /* 如果未耗尽行动数则结束本回合，则会随机做出惩罚，减少心情和体力 */
    if (this.action_count.val == 1) {
      this.status.mood.val   -= Util.get_random_item([0, 0, 1, 1, 2]);
      this.status.energy.val -= Util.get_random_item([0, 0, 0, 1, 1]);
    }
    else if (this.action_count.val > 1) {
      this.status.mood.val   -= Util.get_random_item([0, 1, 2, 2]);
      this.status.energy.val -= Util.get_random_item([0, 0, 1, 1]);
    }
    this.status.mood.val   = Math.max(0, this.status.mood.val  );
    this.status.energy.val = Math.max(0, this.status.energy.val);

    /* 更新状态 */
    this.action_count.val = this.action_count.max;
    this.round_count -= 1;

    /* 重置学习卡 */
    if (this.card_group[0].usage_status & Card.USAGE_STATUS.used) {
      this.card_group[0] = Card_Factory.get_learn_card();
    }
    /* 重置其他卡 */
    for (let i = 1; i < this.card_group.length; i++) {
      if (keep_card_idx != i) {
        this.card_group[i] = Card_Factory.get_card();
      }
    }
    this.update_card_usage_status();

    return new ValTxt(true);
  }

  /* 判断游戏是否结束 return bool */
  is_game_over() {
    if (this.action_count.val == this.action_count.max) {
      /* 没出过卡，说明是直接跳过本回合 */
      this.action_count.val = 0; /* 模拟出卡 */
      this.judge_game_over_after_card();
      this.action_count.val = this.action_count.max; /* 恢复 */
    }
  
    /* 已经出过卡，每次出卡后都有判断过游戏结束 */
    return this.game_outcome.is_over;
  }

  /* 判断游戏是否结束（仅用于出卡后的判断） */
  judge_game_over_after_card() {
    if (this.status.knowledge.val > this.status.knowledge.max) {
      this.game_outcome = {
        is_over   : true,
        is_winner : true,
        text      : "知识学爆",
      }
    }

    if (this.status.money.val > this.status.money.max) {
      this.game_outcome = {
        is_over   : true,
        is_winner : true,
        text      : "爆金币",
      }
    }
    
    if (this.status.health.val <= 0) {
      this.game_outcome = {
        is_over   : true,
        is_winner : false,
        text      : "吸烟过多",
      }
    }

    if (this.action_count.val == 0) {
      if (this.status.energy.val + this.status.mood.val <= 2) {
        this.game_outcome = {
          is_over   : true,
          is_winner : false,
          text      : "身心俱疲",
        }
      }

      if (this.status.energy.val == 0) {
        this.game_outcome = {
          is_over   : true,
          is_winner : false,
          text      : "体力不支",
        }
      }

      if (this.status.mood.val == 0) {
        this.game_outcome = {
          is_over   : true,
          is_winner : false,
          text      : "心情抑郁",
        }
      }

      if (this.status.money.val <= 3) {
        this.game_outcome = {
          is_over   : true,
          is_winner : false,
          text      : "穷困潦倒",
        }
      }
      
      if (this.action_count <= 0) {
        this.game_outcome = {
          is_over   : true,
          is_winner : false,
          text      : "时间耗尽",
        }
      }
    }
  }
}
