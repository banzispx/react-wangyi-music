import React, { useEffect } from 'react';
import Slider from '../../components/slider/';
import { connect } from "react-redux";
import * as actionTypes from './store/actionCreators';
import RecommendList from '../../components/list/';
import Scroll from '../../baseUI/scroll/scrollindex';
import { Content } from './style';
// 延时加载 forceCheck 强制检查，作用暂不清楚
import { forceCheck } from 'react-lazyload';
import { renderRoutes } from 'react-router-config';
import { EnterLoading } from './../Singers/style';
import Loading from '../../baseUI/loading-v2/index';
function Recommend(props){
  const { bannerList, recommendList, songsCount, enterLoading } = props;

  const { getBannerDataDispatch, getRecommendListDataDispatch } = props;
  useEffect(() => {
    if(!bannerList.size){
      getBannerDataDispatch();
    }
    if(!recommendList.size){
      getRecommendListDataDispatch();
    }
    // eslint-disable-next-line
  }, []);
  let pullUp = () => {
    console.log('上拉加载');
  }
  let pullDown = () => {
    console.log('下拉加载');
  }
  // Immutable.JS对象确实有一个toJS()方法，该方法将数据作为纯JavaScript数据结构返回，但是此方法非常慢，并且广泛使用它将抵消Immutable.JS提供的性能优势。
  const bannerListJS = bannerList ? bannerList.toJS() : [];
  const recommendListJS = recommendList ? recommendList.toJS() :[];
  return (
    // onScroll={forceCheck} 当滚动的时候使懒加载的图片显示
    <Content play={songsCount}>
      <Scroll className="list" onScroll={forceCheck} pullUp={pullUp} pullDown={pullDown}>
        <div>
          {/* tab切换 */}
          <Slider bannerList={bannerListJS}></Slider>
          {/* 推荐歌单列表 */}
          <RecommendList recommendList={recommendListJS}></RecommendList>
        </div>
      </Scroll>
      {enterLoading? <EnterLoading><Loading></Loading></EnterLoading> : null}
      { renderRoutes(props.route.routes) }
    </Content> 
  );
}

// 映射Redux全局的state到组件的props上
const mapStateToProps = (state) => ({
  bannerList: state.getIn(['recommend', 'bannerList']),
  recommendList: state.getIn(['recommend', 'recommendList']),
  songsCount: state.getIn(['player', 'playList']).size,
  enterLoading: state.getIn(['recommend', 'enterLoading'])
});
// 映射dispatch到props上
const mapDispatchToProps = (dispatch) => {
  return {
    getBannerDataDispatch() {
      dispatch(actionTypes.getBannerList());
    },
    getRecommendListDataDispatch() {
      dispatch(actionTypes.getRecommendList());
    },

  }
};
// 传入 useMemo 的函数会在渲染期间执行。请不要在这个函数内部执行与渲染无关的操作，诸如副作用这类的操作属于 useEffect 的适用范畴，而不是 useMemo。
// 将ui组件包装成容器组件
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Recommend));
