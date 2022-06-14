import React, {FC, useState, ReactElement, useRef,useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  ScrollView,
  FlatList
} from 'react-native';

export interface StepperProps {
  active: number;
  content: ReactElement[];
  onNext: Function;
  onBack: Function;
  onFinish: Function;
  wrapperStyle?: ViewStyle;
  stepStyle?: ViewStyle;
  stepTextStyle?: TextStyle;
  buttonStyle?: ViewStyle;
  buttonTextStyle?: TextStyle;
  showButton?: boolean;
  activeView?: ReactElement;
}

const search = (keyName: number, myArray: number[]): boolean => {
  let value = false;
  myArray.map((val) => {
    if (val === keyName) {
      value = true;
    }
  });
  return value;
};

const Stepper: FC<StepperProps> = (props) => {
  const {
    active,
    content,
    onBack,
    onNext,
    onFinish,
    wrapperStyle,
    stepStyle,
    stepTextStyle,
    buttonStyle,
    buttonTextStyle,
    showButton = true,
    activeView
  } = props;
  const [step, setStep] = useState<number[]>([0]);
  const listRef = useRef<any>();
  const [act, setAct] = useState<number>(active)

  useEffect(() => {
    if(act !== active){
      setAct(active)
      if (step[step.length - 1] > active) {
        removeData();
      } else {
         pushData(act+1);
      }
    }
    listRef?.current?.scrollToIndex({index:active})
  }, [active]);

  const pushData = (val: number) => {
    setStep((prev) => [...prev, val]);
  };

  const removeData = () => {
    setStep((prev) => {
      prev.pop();
      return prev;
    });
  };



  return (
    <View style={wrapperStyle}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <FlatList 
         showsHorizontalScrollIndicator={false}
         ref={listRef}
         horizontal
         showsVerticalScrollIndicator={false}
         data={content || []}
         renderItem={({index}: {index: any})=>{
          return (
            <React.Fragment key={index}>
              {index !== 0 && (
                <View
                  style={{
                    width: 30,
                    height: 1,
                    backgroundColor: 'grey',
                    opacity: 1,
                    marginHorizontal: 5,
                    alignSelf: 'center'
                  }}
                />
              )}
              <View
                style={[
                  {
                    backgroundColor: '#1976d2',
                    width: 30,
                    height: 30,
                    borderRadius: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity: search(index, step) ? 1 : 0.3,
                  },
                  stepStyle,
                ]}>
                {search(index, step) ? (
                  <Text
                    style={[
                      {
                        color: 'white',
                      },
                      stepTextStyle,
                    ]}>
                    &#10003;
                  </Text>
                ) : (
                  <Text
                    style={[
                      {
                        color: 'white',
                      },
                      stepTextStyle,
                    ]}>
                    {index + 1}
                  </Text>
                )}
              </View>
            </React.Fragment>
          );
         }}
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {activeView}
      </ScrollView>
      {showButton && (
        <View
          style={{
            flexDirection: 'row',
          }}>
          {active !== 0 && (
            <TouchableOpacity
              style={[
                {
                  padding: 10,
                  borderRadius: 4,
                  alignSelf: 'flex-start',
                  marginRight: 10,
                },
                buttonStyle,
                {
                  backgroundColor: '#a1a1a1',
                },
              ]}
              onPress={() => {
                onBack();
              }}>
              <Text style={[{color: 'white'}, buttonTextStyle]}>Back</Text>
            </TouchableOpacity>
          )}
          {content.length - 1 !== active && (
            <TouchableOpacity
              style={[
                {
                  padding: 10,
                  borderRadius: 4,
                  backgroundColor: '#1976d2',
                  alignSelf: 'flex-start',
                  marginRight: 10,
                },
                buttonStyle,
              ]}
              onPress={() => {
                onNext();
              }}>
              <Text style={[{color: 'white'}, buttonTextStyle]}>Next</Text>
            </TouchableOpacity>
          )}
          {content.length - 1 === active && (
            <TouchableOpacity
              style={[
                {
                  padding: 10,
                  borderRadius: 4,
                  backgroundColor: '#1976d2',
                  alignSelf: 'flex-start',
                },
                buttonStyle,
              ]}
              onPress={() => onFinish()}>
              <Text style={[{color: 'white'}, buttonTextStyle]}>Finish</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

export default Stepper;