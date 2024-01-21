import './App.css';
import jsonData from './output.json';
import {useEffect, useState} from "react";
import gs25 from './images/gs25.png'
import seven11 from './images/seveneleven.svg'
import emart24 from './images/emart24.png'
import cu from './images/cu.png'
const { kakao } = window;
export default function App() {


  let map = null
  // 구 목록
  const [selectedGu, setSelectedGu] = useState('강남구');
  const seoulGuList = ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구', '송파구', '양천구', '영등포', '용산구', '은평구', '종로구', '중구', '중랑구'];

  const defaultMarkerimageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

  //마커 포지션
  let positions = [];
  // 구를 선택했을 때 호출되는 함수
  const handleGuChange = (event) => {
    console.log(event.target.value);
    setSelectedGu(event.target.value);
    positions = []

    getMarkerInfoByGu(event.target.value)
    makeMap()
    setMarkerByGu(event.target.value)

  };

  const getMarkerInfoByGu = (gu) => {
    console.log(gu)
    for (const store in jsonData[gu]) {
      if (jsonData[gu][store] == null) continue;
      positions.push({
        title: jsonData[gu][store].place_name,
        latLng: new kakao.maps.LatLng(
            jsonData[gu][store].y,
            jsonData[gu][store].x
        ),
        url: jsonData[gu][store].place_url
      })
    }
  }
  const setMarkerByGu = (gu) => {
    console.log(positions);
    for (var i = 0; i < positions.length; i++) {

      // 마커 이미지의 이미지 크기 입니다
      let imageSize = null
      let markerImage = null

      imageSize = new kakao.maps.Size(35, 35);
      switch (positions[i].title.split(" ")[0]){
        case "이마트24":
          imageSize = new kakao.maps.Size(35, 10);
          markerImage = new kakao.maps.MarkerImage(emart24, imageSize);
          break;
        case "GS25":
          imageSize = new kakao.maps.Size(35, 10);
          markerImage = new kakao.maps.MarkerImage(gs25, imageSize);
          break;
        case "CU":
          imageSize = new kakao.maps.Size(35, 25);
          markerImage = new kakao.maps.MarkerImage(cu, imageSize);
          break;
        case "세븐일레븐":
          imageSize = new kakao.maps.Size(20, 20);
          markerImage = new kakao.maps.MarkerImage(seven11, imageSize);
          break;
        default:
          imageSize = new kakao.maps.Size(35, 15);
          markerImage = new kakao.maps.MarkerImage(defaultMarkerimageSrc, imageSize);
          break;
      }

      // 마커 이미지를 생성합니다

      // 마커를 생성합니다

      let marker = new kakao.maps.Marker({
        position: positions[i].latLng, // 마커를 표시할 위치
        title: positions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
        clickable: true,
        image: markerImage
      });

      marker.setMap(map)

      // 마커를 클릭했을 때 마커 위에 표시할 인포윈도우를 생성합니다
      let iwContent = `<div style="padding:5px;color:black;">${positions[i].title}<br/><a href="${positions[i].url}" target="_blank">자세히보기</a> </div>`, // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
          iwRemoveable = true; // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다

      // 인포윈도우를 생성합니다
      let infowindow = new kakao.maps.InfoWindow({
        content: iwContent,
        removable: iwRemoveable
      });

      // 마커에 클릭/터치이벤트를 등록합니다
      kakao.maps.event.addListener(marker, 'click', function () {
        infowindow.open(map, marker);
      });



      kakao.maps.event.addListener(marker, 'mouseout', function () {
        setTimeout(() => {
          infowindow.close(map, marker);
        }, 1000);
      });
      kakao.maps.event.addListener(marker, 'touchend', function () {
        setTimeout(() => {
          infowindow.close(map, marker);
        }, 1000);
        // 마커 위에 인포윈도우를 표시합니다
      });

    }
  }

  const makeMap = () => {
    var container = document.getElementById('map')
    console.log(positions[0].latLng.La, positions[0].latLng.Ma)
    var options = {
      center: positions[0].latLng,
      level: 7,
    }
    map = new window.kakao.maps.Map(container, options)
  }

    useEffect(() => {
      const kakaoMapScript = document.createElement('script')
      kakaoMapScript.async = false
      kakaoMapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_MAP_APP_KEY}&autoload=false`
      document.head.appendChild(kakaoMapScript)

      const onLoadKakaoAPI = () => {
        window.kakao.maps.load(async () => {
          getMarkerInfoByGu(selectedGu)
          makeMap()
          setMarkerByGu(selectedGu)
        })
      }
      kakaoMapScript.addEventListener('load', onLoadKakaoAPI)

    }, [])


    return (
        <div>
          <h1> 기후동행카드를 찾아서. </h1>
          <h3> 내 주변 기후동행카드를 구매할 수 있는 편의점은 어디?</h3>
          <h5> 개발자의 한계로 모바일에서는 클릭해도 정보가 안보입니다...... </h5>
          <h5>일단은 PC화면을 이용해주세요.. 쥬륵..</h5>
          <select id="guSelect" value={selectedGu} onChange={handleGuChange}>
            <option value="">구를 선택하세요</option>
            {seoulGuList.map((gu) => (
                <option key={gu} value={gu}>
                  {gu}
                </option>
            ))}
          </select>
          <div id="map"
               style={{width: '100%', 'height': '500px', display: 'block', margin: '5px'}}>
          </div>


          <div>
            <h2>하기 편의점들은 현재 정보 수집중입니다</h2>
            <p>강남구 이마트24 동일타워점</p>
            <p>강동구 이마트24 고덕디엠스퀘어점</p>
            <p>강서구 GS25  가양글로벌점</p>
            <p>강서구 이마트24 왈도강서캠퍼스점</p>
            <p>동대문구 이마트24 전농배봉로점</p>
            <p>동작구 GS25  작역점</p>
            <p>동작구 GS25  상도스위트점</p>
            <p>마포구 이마트24 홍대합정점</p>
            <p>마포구 이마트24 R마포망원로점</p>
            <p>서대문구 세븐일레븐 서대문푸르지오점</p>
            <p>서초구 이마트24 호반건설사옥점</p>
            <p>성동구 GS25  금호예향점</p>
            <p>성동구 이마트24 R한양여대스퀘어점</p>
            <p>성동구 이마트24 성동플라이쿱점</p>
            <p>송파구 GS25  S9삼전역점</p>
            <p>송파구 이마트24 송파해누리점</p>
            <p>영등포 이마트24 양평선유도점</p>
            <p>영등포 이마트24 여의콤비점</p>
            <p>영등포 이마트24 어반322점</p>
            <p>용산구 이마트24 용산트럼프월드점</p>
            <p>은평구 GS25  녹번퍼스트점</p>
            <p>은평구 이마트24 R갈현대로점</p>
            <p>중랑구 CU 면목새롬점</p>
          </div>
            <div>
              <h1>문의사항 : vividxenon@gmail.com</h1>
            </div>

        </div>

    )
  }