<template>
  <div class="box">
    <div class="tit">重点关注对象</div>
    <div class="boxnav">
      <ul class="zjia">
        <li v-for="person in people" :key="person.name">
          <img :src="getImageUrl(person.avatar)" />
          <h3>{{ person.name }}</h3>
          <span>{{ person.status }}</span>
          <span>{{ person.code || '暂无' }}</span>
          <p>{{ person.address }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'KeyPeople',
  setup() {
    const people = [
      {
        name: '王阿姨',
        avatar: 'aunt.png',
        status: '待处理',
        code: '',
        address: '北京市门头沟区汤臣一品1栋1单元1号',
      },
      {
        name: '李奶奶',
        avatar: 'grandma.png',
        status: '待处理',
        code: '',
        address: '北京市门头沟区汤臣一二品1栋1单元1号',
      },
      {
        name: '苗叔',
        avatar: 'miao.png',
        status: '待处理',
        code: 'T-20250113-56',
        address: '北京市门头沟区汤臣一三品1栋1单元1号',
      },
      {
        name: '马爷爷',
        avatar: 'grandpa.png',
        status: '待处理',
        code: '',
        address: '北京市门头沟区汤臣一四品1栋1单元1号',
      },
    ]

    const getImageUrl = (name) => {
      return new URL(`../../assets/images/${name}`, import.meta.url).href
    }

    return {
      people,
      getImageUrl,
    }
  },
}
</script>

<style scoped>
.box {
  height: 100%;
  background: rgba(0, 24, 106, 0.6);
  display: flex;
  flex-direction: column;
}

.tit {
  /* padding: 10px 15px; */
  color: #fff;
  font-size: 18px;
  letter-spacing: normal;
}

.boxnav {
  flex: 1;
  padding: 5px 15px 15px;
  overflow: hidden;
}

.zjia li {
  display: inline-block;
  vertical-align: top;
  width: calc(50% - 10px);
  margin: 5px;
  padding: 10px;
  background: rgba(0, 24, 106, 0.6);
  box-sizing: border-box;
  min-height: 120px;
}

.zjia li img {
  display: block;
  float: left;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
}

.zjia li h3 {
  font-size: 16px;
  color: #fff;
  margin-bottom: 5px;
}

.zjia li span {
  display: inline-block;
  padding: 0 5px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 12px;
  margin-right: 5px;
  margin-bottom: 5px;
}

.zjia li p {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.2;
}
</style>
