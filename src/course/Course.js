import React, {useState, useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import {scale} from 'react-native-size-matters';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import {Backbar} from '../components/BackBar';

export default function Course({navigation, route}) {
  axiosRetry(axios, {retries: 3});

  const {courseID, token, courseName} = route.params;
  //data for flatlist
  const [DATA, setData] = useState([]);
  //url of video,...
  const [url, setUrl] = useState('');
  //check see element or not
  const [viewChild, setViewChild] = useState('');
  //store chapterID
  const [chapterID, setChapterID] = useState('');
  //store all element in each item
  const [dataElement, setDataElement] = useState([]);

  function renderItemElement({item}) {
    // console.log('elemt', item);
    const ReadFile = () => {
      return chooseOpenEditor(changeURL());
    };
    function changeURL() {
      if (item.courseWare.files.startsWith('/e-learning')) {
        setUrl(`http://elearning-uat.tmgs.vn${item.courseWare.files}`);
      } else if (item.courseWare.files.startsWith('https://www.youtube.com')) {
        setUrl(item.courseWare.files);
      }
      return url;
    }
    function chooseOpenEditor(newURL) {
      // changeURL();
      // console.log(newURL);
      const fileExtension = newURL.slice(-4);
      if (newURL.startsWith('https://www.youtube.com')) {
        navigation.navigate('WebViewComponent', {
          url: newURL,
          type: 'youtube',
        });
      }
      switch (fileExtension) {
        case 'pptx': {
          navigation.navigate('WebViewComponent', {
            url: newURL,
            type: 'doc',
          });
          break;
        }
        case '.pdf': {
          navigation.navigate('ReadPDF', {url: newURL});
          break;
        }
        case 'docx':
        case '.doc': {
          navigation.navigate('WebViewComponent', {
            url: newURL,
            type: 'doc',
          });
          break;
        }
        case 'xlsx': {
          navigation.navigate('WebViewComponent', {
            url: newURL,
            type: 'doc',
          });
          break;
        }
        case '.rar': {
          navigation.navigate('');
          break;
        }
        case '.mp3': {
          navigation.navigate('RenderSound', {url: newURL});
          break;
        }
        case '.mp4': {
          navigation.navigate('RenderSound', {url: newURL});
          break;
        }
        case '.png':
        case '.jpg': {
          navigation.navigate('WebViewComponent', {
            url: newURL,
            type: 'img',
          });
          break;
        }
      }
    }
    return (
      <TouchableOpacity
        style={styles.btnChild}
        onPress={() => {
          ReadFile();
        }}>
        <Text style={styles.txt}>
          {item.courseWare.name ? item.courseWare.name : 'Ch??a c?? t??i li???u'}
        </Text>
      </TouchableOpacity>
    );
  }

  const renderItem = ({item}) => {
    // console.log('item', item);

    return (
      <View style={styles.titleChapter}>
        <TouchableOpacity
          onPress={() => {
            setViewChild(item.id);
            setDataElement(item.chapterCourseWares);
            // console.log('aloha', item.chapterCourseWares);
          }}>
          <Text style={styles.txt}>{`${item.name}`}</Text>
        </TouchableOpacity>
        {viewChild === item.id && dataElement !== [] && (
          <FlatList
            style={styles.FlatList}
            data={dataElement}
            keyExtractor={(item) => {
              item.id.toString();
            }}
            renderItem={renderItemElement}
          />
        )}
      </View>
    );
  };

  function getChapLesson() {
    axios
      .get(`http://elearning-uat.tmgs.vn/api/course-ware/course/${courseID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => {
        console.log('get chap lesson has been err', err);
      });
  }

  useEffect(() => {
    if (token.length > 0) {
      getChapLesson();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  return (
    <View style={styles.container}>
      <Backbar title={courseName} container={styles.container} />
      {DATA.length !== [] ? (
        <View style={styles.body}>
          <View>
            <FlatList
              style={styles.FlatList}
              data={DATA}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
            />
            <View style={styles.btn}>
              <TouchableOpacity
                style={styles.btnExamination}
                onPress={() => {}}>
                <Text>{'Thi cu???i kh??a'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <View style={{alignItems: 'center'}}>
          <Text style={{color: 'red'}}>{'Ch??a c?? video h???c li???u'}</Text>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  backgroundVideo: {
    width: '100%',
    height: scale(200),
  },
  mediaControls: {
    height: '100%',
    flex: 1,
    alignSelf: 'center',
  },
  toolbar: {
    marginTop: 30,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  body: {
    flex: 9,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  imgBlack: {
    width: '100%',
    backgroundColor: 'black',
    height: scale(200),
  },
  items: {
    padding: scale(10),
    justifyContent: 'center',
    width: '100%',
    height: scale(50),
  },
  btn: {justifyContent: 'center', alignItems: 'center'},
  btnExamination: {
    width: scale(200),
    height: scale(50),
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(20),
    margin: scale(10),
  },
  titleChapter: {
    marginTop: scale(5),
    marginLeft: scale(10),
    justifyContent: 'center',
    width: '100%',
  },
  txtTitle: {
    color: '#000',
    width: scale(380),
    flexDirection: 'row',
  },
  titleLesson: {
    justifyContent: 'center',
    marginLeft: scale(20),
    width: scale(300),
    height: scale(40),
  },
  txtLesson: {color: '#000'},
  line: {width: '100%', height: scale(1), backgroundColor: '#aaa'},
  FlatList: {
    marginHorizontal: scale(15),
    marginVertical: scale(15),
    width: scale(300),
  },
  txtLessonC: {color: '#144E8C'},
  video: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  videoBTN: {
    position: 'absolute',
    top: scale(0),
    right: scale(0),
    bottom: scale(0),
    left: scale(0),
  },
  menu: {
    flex: 3,
    position: 'absolute',
    top: scale(220),
    marginHorizontal: scale(0),
    width: '100%',
  },
  btnChild: {
    paddingVertical: scale(10),
    marginLeft: scale(10),
    justifyContent: 'center',
    width: '100%',
    height: scale(40),
    borderBottomWidth: 1,
    paddingLeft: scale(40),
    borderColor: '#aaa',
  },
  headerCollap: {
    marginTop: scale(5),
    marginLeft: scale(10),
    justifyContent: 'center',
    width: '100%',
    height: scale(50),
    borderBottomWidth: scale(1),
    borderColor: '#aaa',
    paddingVertical: scale(10),
  },
  bodyCollap: {
    marginTop: scale(5),
    marginLeft: scale(10),
    justifyContent: 'center',
    width: '100%',
    height: scale(50),
    borderBottomWidth: scale(1),
    borderColor: '#aaa',
  },
  txt: {fontSize: scale(15)},
});
