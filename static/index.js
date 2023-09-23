const fillLine = () => {
  const stroke = [...document.querySelectorAll('.line .word-stroke')]
  stroke.forEach(item => {
    const detail = [...item.querySelectorAll('.word-stroke-detail')];
    const last = detail[detail.length - 1];
    let length = 12;
    if (detail.length  > 12 ) {
      length = 12 * 2;
    }
    for (let key = detail.length ; key < length; key++) {
      const lastNode = last.cloneNode(true);
      lastNode.setAttribute('append-node', true);
      item.appendChild(lastNode);
    }
  })
}

const app = Vue.createApp({
  setup() {
    const input = Vue.ref('天安门');
    // 爱北京天安门
    const list = Vue.ref([]);
    const search = () => {
      if (input.value) {
        axios.get(`/get/${input.value}`).then(({data})=>{
          list.value = data.data;
        }).then(()=>{
          Vue.nextTick(()=>{
            fillLine();
          })
        })
      }
    }
    return {
      input,
      list,
      search,
    }
  }
});

app.use(ElementPlus);
app.mount('#app');
