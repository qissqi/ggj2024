class Util {
  static get_random_int(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  static get_random_item(lst) {
    return lst[Util.get_random_int(0, lst.length - 1)];
  }
}

class Card {
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

  /* 虚函数，要求返回字符串，以表示该卡的使用效果 */
  special_effect(player) { return this.description; }
}

class Card_Learn extends Card {
  constructor() {
    super();
    this.name = "知识学爆";
    this.img_url = "../static/img/知识学爆2.jpg";
    this.effect = {
      knowledge: Util.get_random_item([1, 1, 1, 1, 1, 1, 1, 2, 2, 3]),
      mood:      Util.get_random_item([-2, -1, -1, 0, 0, 1]),
      energy:    Util.get_random_item([-2, -1, -1, -1, -1, -1, 0, 0]),
      money:     Util.get_random_int(-5, 1),
      health:    0,
    };
    this.description = "万般皆下品，唯有读书高";
  }
}

class Card_Listen_To_Music extends Card {
  constructor() {
    super();
    this.name = "听音乐";
    this.img_url = "../static/img/专辑.jpg";
    this.effect = {
      knowledge: 0,
      mood:      Util.get_random_item([1, 1, 2, 2, 2, 3]),
      energy:    Util.get_random_item([0, 0, 0, 1, 1]),
      money:     Util.get_random_int(-5, -1),
      health:    0,
    };
    this.description = "欣赏音乐，放松心情";
  }

  special_effect(player) {
    /* 在这里调用音乐播放器 */
  };
}

class Card_Play_Phone extends Card {
  constructor() {
    super();
    this.name = "网上冲浪";
    this.img_url = "../static/img/玩手机.jpg";
    this.effect = {
      knowledge: 0,
      mood:      Util.get_random_item([1, 1, 1, 1, 1, 1, 2, 2, 3]),
      energy:    Util.get_random_item([0, 0, 0, 0, 0, -1, -1]),
      money:     Util.get_random_int(-5, -1),
      health:    0,
    };
    this.description = "5G上网，放松心情";
  }
}

class Card_Sleep extends Card {
  constructor() {
    super();
    this.name = "睡大觉";
    this.img_url = "../static/dz_test.jpeg";
    this.effect = {
      knowledge: 0,
      mood:      Util.get_random_item([1, 1, 1, 2, 2, 3]),
      energy:    Util.get_random_item([1, 2, 2, 3, 3, 3, 3, 3, 4, 5]),
      money:     0,
      health:    0,
    };
    this.description = "软绵绵的床好舒服";
  }
}

class Card_Smoke extends Card {
  constructor() {
    super();
    this.name = "抽电子烟";
    this.img_url = "../static/img/电子烟.png";
    this.effect = {
      knowledge: 0,
      mood:      Util.get_random_item([1, 2, 3, 3, 3, 3, 4, 4, 5]),
      energy:    Util.get_random_item([0, 1, 2, 2, 2, 3, 3, 4]),
      money:     Util.get_random_int(-15, -8),
      health:    Util.get_random_item([-5, -4, -4, -3, -3, -3, -2]),
    };
    this.description = "芜湖芜湖真的好满足";
  }
}

class Card_Play_With_Snow_Leopard extends Card {
  constructor() {
    super();
    this.name = "陪雪豹玩耍";
    this.img_url = "../static/img/雪豹.jpeg";
    this.effect = {
      knowledge: 0,
      mood:      Util.get_random_item([1, 2, 2, 3]),
      energy:    Util.get_random_int(-1, 1),
      money:     0,
      health:    0,
    };
    this.description = "芝士雪豹，我的动物朋友";
  }
}

class Card_Random_Event extends Card {
  constructor() {
    super();
    this.name = "随机事件";
    this.img_url = "";
    this.effect = {
      knowledge: 0,
      mood:      0,
      energy:    0,
      money:     0,
      health:    0,
    };
    this.description = "触发随机事件";
  }

  special_effect(player) {
    return "还没做";
  }
}

class Card_Factory {
  static card_class_list = [
    Card_Learn,
    Card_Listen_To_Music,
    Card_Play_Phone,
    Card_Sleep,
    Card_Smoke,
    Card_Play_With_Snow_Leopard,

    Card_Random_Event,
  ];

  static get_learn_card() {
    return new Card_Learn();
  }
  static get_random_card() {
    return new (Util.get_random_item(Card_Factory.card_class_list))();
  }
}

/* 用作携带文本信息的返回值类型 */
class ValTxt {
  constructor(val, txt="") {
    this.val = val;
    this.txt = txt;
  }
}

class Player {
  constructor() {
    this.status = {
      knowledge:  { val: 0, max: 100  },
      mood:       { val: 0, max: 20   },
      energy:     { val: 0, max: 20   },
      money:      { val: 0            },
      health:     { val: 0, max: 100  },
    }
    this.round_count   = 1;
    this.action_count  = { val: 0, max: 4 };
    this.card_group    = [];
    this.keep_card_idx = null;
  }

  /* 重置，开始新的一局 */
  reset() {
    /* 重置状态 */
    this.status.knowledge.val = 0;
    this.status.mood     .val = 10;
    this.status.energy   .val = 10;
    this.status.money    .val = 100;
    this.status.health   .val = 100;

    this.round_count = 1;
    this.action_count.val = this.action_count.max;

    /* 重置卡组 */
    this.card_group.length = 0;
    this.card_group.push(Card_Factory.get_learn_card());
    this.card_group.push(Card_Factory.get_random_card());
    this.card_group.push(Card_Factory.get_random_card());
    this.card_group.push(Card_Factory.get_random_card());
    this.card_group.push(Card_Factory.get_random_card());
    this.card_group.push(Card_Factory.get_random_card());
    this.update_card_usage_status();
  }

  /* 用于更新卡状态：是否可用（用卡后调用本函数）*/
  update_card_usage_status() {
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

  /* 判断卡是否可用（用卡前调用本函数） return ValTxt(bool, ) */
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

    /* 卡牌发挥特殊效果 */
    let result_text = card.special_effect(this);

    /* 更新卡的状态 */
    card.usage_status &= ~Card.USAGE_STATUS.usable;
    card.usage_status |=  Card.USAGE_STATUS.used;
    this.update_card_usage_status();

    return new ValTxt(true, result_text);
  }

  /* 强制用卡 */
  force_use_card(card) {
    /* 不检测卡是否可用 */

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
    /* this.action_count.val -= 1; */

    /* 卡牌发挥特殊效果 */
    let result_text = card.special_effect(this);

    /* 更新其他卡的状态，不更新本卡的状态 */
    this.update_card_usage_status();
    /* card.usage_status &= ~Card.USAGE_STATUS.usable;
       card.usage_status |=  Card.USAGE_STATUS.used;   */

    return new ValTxt(true, result_text);
  }

  /* 开启下一回合（可选一张未使用过的卡以保留） return ValTxt(bool, ) */
  next_round(keep_card_idx=null) {
    if (null != keep_card_idx) {
      if (0 == keep_card_idx) {
        return new ValTxt(false, "无须继承固定的学习卡");
      }
      else if (this.card_group[keep_card_idx].usage_status & Card.USAGE_STATUS.used) {
        return new ValTxt(false, "无法继承已使用过的卡");
      }
    }

    /* 重置学习卡 */
    if (this.card_group[0].usage_status & Card.USAGE_STATUS.used) {
      this.card_group[0] = Card_Factory.get_learn_card();
    }
    /* 重置其他卡 */
    for (let i = 1; i < this.card_group.length; i++) {
      if (keep_card_idx != i) {
        this.card_group[i] = Card_Factory.get_random_card();
      }
    }

    /* 更新状态 */
    this.action_count.val = this.action_count.max;
    this.round_count += 1;

    this.update_card_usage_status();

    return new ValTxt(true);
  }

  /* 判断胜利 */
  is_win() {
    return this.status.knowledge.val > this.status.knowledge.max;
  }
}
