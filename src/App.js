import logo from './logo.svg';
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
  const seoulGuList = ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'];

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
      let iwContent = `<div style="padding:5px;color:black;">${positions[i].title}<br/><a href="${positions[i].url}">자세히보기</a> </div>`, // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
          iwRemoveable = true; // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다

      // 인포윈도우를 생성합니다
      let infowindow = new kakao.maps.InfoWindow({
        content: iwContent,
        removable: iwRemoveable
      });

      // 마커에 클릭이벤트를 등록합니다
      kakao.maps.event.addListener(marker, 'mouseover', function () {
        // 마커 위에 인포윈도우를 표시합니다
        infowindow.open(map, marker);
      });

      kakao.maps.event.addListener(marker, 'mouseout', function () {

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
          <select id="guSelect" value={selectedGu} onChange={handleGuChange}>
            <option value="">구를 선택하세요</option>
            {seoulGuList.map((gu) => (
                <option key={gu} value={gu}>
                  {gu}
                </option>
            ))}
          </select>
          <div id="map"
               style={{width: '80%', 'height': '500px', display: 'block', margin: '5px'}}>
          </div>


        </div>

    )
  }