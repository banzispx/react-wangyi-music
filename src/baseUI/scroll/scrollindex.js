/*
    下为问题代码，以此为鉴
  useEffect(() => {
  if(bScroll) return;
  const scroll = new BScroll(scrollContaninerRef.current, {
    scrollX: direction === "horizental",
    scrollY: direction === "vertical",
    probeType: 3,
    click: click,
    bounce:{
      top: bounceTop,
      bottom: bounceBottom
    }
  });
  setBScroll(scroll);
  if(pullUp) {
    scroll.on('scrollEnd', () => {
      //判断是否滑动到了底部
      if(scroll.y <= scroll.maxScrollY + 100){
        pullUp();
      }
    });
  }
  if(pullDown) {
    scroll.on('touchEnd', (pos) => {
      //判断用户的下拉动作
      if(pos.y > 50) {
        debounce(pullDown, 0)();
      }
    });
  }

  if(onScroll) {
    scroll.on('scroll', (scroll) => {
      onScroll(scroll);
    })
  }

  if(refresh) {
    scroll.refresh();
  }
  return () => {
    scroll.off('scroll');
      setBScroll(null);
    }
    // eslint-disable-next-line
  }, []);
*/
import React, { forwardRef, useState,useEffect, useRef, useImperativeHandle, useMemo } from "react"
import PropTypes from "prop-types"
// 滚动插件
import BScroll from "better-scroll"
import styled from 'styled-components';
import Loading from '../loading/index';
import Loading2 from '../loading-v2/index';
import { debounce } from "../../api/utils";

const ScrollContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`

const PullUpLoading = styled.div`
  position: absolute;
  left:0; right:0;
  bottom: 5px;
  width: 60px;
  height: 60px;
  margin: auto;
  z-index: 100;
`

export const PullDownLoading = styled.div`
  position: absolute;
  left:0; right:0;
  top: 0px;
  height: 30px;
  margin: auto;
  z-index: 100;
`
// useImperativeHandle 可以让你在使用 ref 时自定义暴露给父组件的实例值。
// 在大多数情况下，应当避免使用 ref 这样的命令式代码。useImperativeHandle 应当与 forwardRef 一起使用：
const Scroll = forwardRef((props, ref) => {
  const [bScroll, setBScroll] = useState();

  const scrollContaninerRef = useRef();
  const { pullUp, pullDown, onScroll, direction, click, refresh, pullUpLoading, pullDownLoading, bounceTop, bounceBottom } = props;
  // 上拉加载 pullUpDebounce 只有渲染或依赖项改变的时候才执行
  let pullUpDebounce = useMemo(() => {
    return debounce(pullUp, 500)
  }, [pullUp]);
  // 下拉刷新
  let pullDownDebounce = useMemo(() => {
    return debounce(pullDown, 500)
  }, [pullDown]);
  // 组件挂载时初始化滚动对象 并且在卸载时删除此对象
  useEffect(() => {
    // https://better-scroll.github.io/docs/zh-CN/guide/base-scroll-options.html#scrollx scroll配置项详情
    const scroll = new BScroll(scrollContaninerRef.current, {
      scrollX: direction === "horizental",
      scrollY: direction === "vertical",
      // probeType 3 代表从滚动开始 -》动画 -》结束都会触发滚动事件
      probeType: 3,
      // BetterScroll 默认会阻止浏览器的原生 click 事件。当设置为 true，BetterScroll 会派发一个 click 事件，我们会给派发的 event 参数加一个私有属性 _constructed，值为 true
      click: click,
      // 上拉 下拉的动画
      bounce:{
        top: bounceTop,
        bottom: bounceBottom
      }
    });
    // 这里会再次的render此滚动组件
    setBScroll(scroll);
    return () => {
      setBScroll(null);
    }
    // eslint-disable-next-line
  }, []);
  // 监听滚动对象 当滚动时触发滚动事件
  useEffect(() => {
    if(!bScroll || !onScroll) return;
    bScroll.on('scroll', onScroll)
    return () => {
      bScroll.off('scroll', onScroll);
    }
  }, [onScroll, bScroll]);
  // 上拉的effeck 在滚动结束的时候判断当前位置与bScroll的最大滚动高度的差距
  useEffect(() => {
    if(!bScroll || !pullUp) return;
    const handlePullUp = () => {
      //判断是否滑动到了底部
      if(bScroll.y <= bScroll.maxScrollY + 100){
        pullUpDebounce();
      }
    };
    bScroll.on('scrollEnd', handlePullUp);
    return () => {
      bScroll.off('scrollEnd', handlePullUp);
    }
  }, [pullUp, bScroll, pullUpDebounce]);
  // 下拉的事件
  useEffect(() => {
    if(!bScroll || !pullDown) return;
    const handlePullDown = (pos) => {
      // pos 当前事件结束后的位置坐标
      //判断用户的下拉动作
      if(pos.y > 50) {
        pullDownDebounce();
      }
    };
    // touchEnd 触发时机 用户手指离开滚动区域
    bScroll.on('touchEnd', handlePullDown);
    return () => {
      bScroll.off('touchEnd', handlePullDown);
    }
  }, [pullDown, pullDownDebounce, bScroll]);
  // 挂载 更新 都会执行这句话
  useEffect(() => {
    if(refresh && bScroll){
      // 作用：重新计算 BetterScroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常。
      bScroll.refresh();
    }
  });
  // 使父组件可以获取子组件的事件
  useImperativeHandle(ref, () => ({
    refresh() {
      if(bScroll) {
        bScroll.refresh();
        bScroll.scrollTo(0, 0);
      }
    },
    getBScroll() {
      if(bScroll) {
        return bScroll;
      }
    }
  }));

  const PullUpdisplayStyle = pullUpLoading ? { display: "" } : { display: "none" };
  const PullDowndisplayStyle = pullDownLoading ? { display: "" } : { display: "none" };
  return (
    <ScrollContainer ref={scrollContaninerRef}>
      {props.children}
      {/* 滑到底部加载动画 */}
      <PullUpLoading style={ PullUpdisplayStyle }><Loading></Loading></PullUpLoading>
      {/* 顶部下拉刷新动画 */}
      <PullDownLoading style={ PullDowndisplayStyle }><Loading2></Loading2></PullDownLoading>
    </ScrollContainer>
  );
})

Scroll.defaultProps = {
  direction: "vertical",
  click: true,
  refresh: true,
  onScroll:null,
  pullUpLoading: false,
  pullDownLoading: false,
  pullUp: null,
  pullDown: null,
  bounceTop: true,
  bounceBottom: true
};

Scroll.propTypes = {
  direction: PropTypes.oneOf(['vertical', 'horizental']),
  refresh: PropTypes.bool,
  onScroll: PropTypes.func,
  pullUp: PropTypes.func,
  pullDown: PropTypes.func,
  pullUpLoading: PropTypes.bool,
  pullDownLoading: PropTypes.bool,
  bounceTop: PropTypes.bool,//是否支持向上吸顶
  bounceBottom: PropTypes.bool//是否支持向下吸顶
};

export default Scroll;