import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { MovieSession } from '../../service';
import { colors } from '../../style';

type Props = {
  sessions: MovieSession[];
};

const MovieSessionList = ({ sessions }: Props) => {
  return (
    <FlatList
      removeClippedSubviews={true}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={10}
      data={sessions}
      keyExtractor={session => session.id}
      renderItem={({ item: session }) => {
        return (
          <View style={styles.sessionDetails}>
            <Text style={styles.sessionTime}>{session.time}</Text>
            <FlatList
              removeClippedSubviews={true}
              maxToRenderPerBatch={3}
              updateCellsBatchingPeriod={10}
              horizontal
              data={session.types}
              keyExtractor={type => `${type.id}`}
              renderItem={({ item: type }) => {
                return <Text style={styles.smallBadge}>{type.alias}</Text>;
              }}
            />
          </View>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  sessionDetails: {
    flexDirection: 'row',
  },
  sessionTime: {
    color: colors.white,
    marginHorizontal: 8,
  },
  smallBadge: {
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 5,
    marginRight: 2,
    marginVertical: 1,
    color: colors.bodyBackgroundColor,
  },
});

export default MovieSessionList;
