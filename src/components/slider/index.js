import React, { useEffect, useState } from 'react';
import { SliderContainer } from './style';
import "swiper/dist/css/swiper.css";
import Swiper from "swiper";
// swipper的链接https://www.swiper.com.cn/usage/index.html
function Slider(props) {
  // 下面这个useState其实没啥用，去掉不影响逻辑
  const [sliderSwiper, setSliderSwiper] = useState(null);
  const { bannerList } = props;

  useEffect(() => {
    if(bannerList.length && !sliderSwiper){
        let sliderSwiper = new Swiper(".slider-container", {
          // 循环模式选项
          loop: true,
          // 如果需要前进后退按钮
          // navigation: {
          //   nextEl: '.swiper-button-next',
          //   prevEl: '.swiper-button-prev',
          // },
          autoplay: {
            delay: 3000,
            disableOnInteraction: false,
          },
          // 如果需要分页器
          pagination: {el:'.swiper-pagination'},
        });
        setSliderSwiper(sliderSwiper);
    }
  }, [bannerList.length, sliderSwiper])
  return (
    <SliderContainer>   
      <div className="before"></div>
      <div className="slider-container">
        {/* <div className="swiper-button-next"></div>
        <div className="swiper-button-prev"></div> */}
        <div className="swiper-wrapper">
          {
            bannerList.map(slider => {
              return (
                <div className="swiper-slide" key={slider.imageUrl}>
                  <div className="slider-nav">
                    <img src={slider.imageUrl} width="100%" height="100%" alt="推荐" />
                  </div>
                </div>
              );
            })
          }
        </div>
        <div className="swiper-pagination"></div>
      </div> 
    </SliderContainer>
  );
}


export default React.memo(Slider);