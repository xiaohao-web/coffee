class Valid{

  constructor() {
    //手机号正则表达式
    this.phone = {
      reg: /^1[3-9]\d{9}$/,
      msg: '请填写正确手机号'
    }

    //昵称正则表达式
    //含有字母,数字字母汉字组合
    this.nickName = {
      reg: /^[0-9a-zA-Z\u4e00-\u9fa5]{1,8}$/,
      msg: '昵称必须含有字母,数字字母汉字组合'
    }

    //密码正则表达式
    //首个字符是字母, 除了汉字的其他字符
    this.password = {
      reg: /^([a-zA-Z]|[1-9])[^\u4e00-\u9fa5]{5,12}$/,
      msg: '密码不能含有汉字或者为空'
    }
	
	 this.formerPassword = {
	  reg: /^([a-zA-Z]|[1-9])[^\u4e00-\u9fa5]{5,12}$/,
	  msg: '密码不能含有汉字或者为空和位数不够'
	}
	
	//邮箱正则表达式
	this.email = {
	  reg: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
	  msg: '邮箱格式不正确'
	}
  }


  validForm(o, t) {

    

    for (let key in o) {
      if (!this[key].reg.test(o[key])) {
        t.$toast(this[key].msg)

        //表单验证不通过
        return false;
      }
    }

    //表单验证通过
    return true;

  }

}

export const valid = new Valid();