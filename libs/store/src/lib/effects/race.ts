import {
  AppPlayerId,
  AppPlayerProfiles,
  AppRace,
  AppRaceId,
  AppTournament,
  AppTournamentId,
  AppTournamentState,
} from '@razor/models';
import {
  calculateTimeoutTimer,
  extractId,
  extractIdType,
  generateLeaderboard,
  giveZeroPadding,
} from '@razor/util';
import { playerNotFound, tournamentNotFound, raceNotFound } from '../raisers';
import {
  endCountdownPayload,
  endRacePayload,
  startCountdownPayload,
} from '../payloads';
import { Dispatch, RootState } from '../store';

//TODO: should move this to server later
const loadRacingText = async (): Promise<string> => {
  const url = 'http://www.metaphorpsum.com/paragraphs/1/8';

  return fetch(url)
    .then(response => response.text())
    .then(data => {
      return data;
    });
};

export const startCountdown = async (
  dispatch: Dispatch,
  payload: startCountdownPayload,
  state: RootState,
): Promise<void> => {
  const {
    tournamentId,
    playerId,
  }: { tournamentId: AppTournamentId; playerId: AppPlayerId } = payload;

  if (!state.game.tournamentsModel[tournamentId])
    tournamentNotFound(dispatch, tournamentId, `Started by: ${playerId}`);
  if (!state.game.playersModel[playerId])
    playerNotFound(
      dispatch,
      playerId,
      `While tournament starting: ${tournamentId}`,
    );

  const numberOfRacesBefore =
    state.game.tournamentsModel[tournamentId] &&
    state.game.tournamentsModel[tournamentId].raceIds.length;
  const raceIndex = numberOfRacesBefore
    ? giveZeroPadding(numberOfRacesBefore.toString(), 3)
    : '000';
  const raceId: AppRaceId = `${tournamentId}-R:${raceIndex}`;
  const players: AppPlayerProfiles = {};

  for (const id of state.game.tournamentsModel[tournamentId].playerIds) {
    const player = state.game.playersModel[id];
    if (!player) {
      if (!state.game.playersModel[playerId])
        playerNotFound(
          dispatch,
          playerId,
          `While players are being added to: ${tournamentId}`,
        );
    } else {
      players[id] = {
        name: player.name,
        avatarLink: player.avatarLink,
      };
    }
  }

  const raceText = await loadRacingText();
  const timeoutDuration = await calculateTimeoutTimer(raceText);

  const race: AppRace = {
    text: raceText,
    timeoutDuration: timeoutDuration,
    startedTimestamp: new Date().getTime(),
    players: players,
    isOnGoing: true,
    raceStartedBy: playerId,
  };

  const tournament: AppTournament = {
    ...state.game.tournamentsModel[tournamentId],
    state: AppTournamentState.Countdown,
    raceIds: [...state.game.tournamentsModel[tournamentId].raceIds, raceId],
  };

  dispatch.game.updateTournamentReducer({
    tournamentId,
    tournament,
  });

  dispatch.game.updateRaceReducer({
    raceId,
    race,
  });
};

export const endCoundown = async (
  dispatch: Dispatch,
  payload: endCountdownPayload,
  state: RootState,
): Promise<void> => {
  const { tournamentId }: { tournamentId: AppTournamentId } = payload;

  if (!state.game.tournamentsModel[tournamentId])
    tournamentNotFound(dispatch, tournamentId, `While countdown ending`);

  const tournament: AppTournament = {
    ...state.game.tournamentsModel[tournamentId],
    state: AppTournamentState.Race,
    raceIds: [...state.game.tournamentsModel[tournamentId].raceIds],
  };
  dispatch.game.updateTournamentReducer({
    tournamentId,
    tournament,
  });
};

export const endRace = async (
  dispatch: Dispatch,
  payload: endRacePayload,
  state: RootState,
): Promise<void> => {
  const { raceId }: { raceId: AppRaceId } = payload;

  if (!state.game.racesModel[raceId])
    raceNotFound(dispatch, raceId, `While race ending`);

  const tournamentId: AppTournamentId = extractId(
    raceId,
    extractIdType.race,
    extractIdType.tournament,
  ) as AppTournamentId;

  const tournament: AppTournament = {
    ...state.game.tournamentsModel[tournamentId],
    state: AppTournamentState.Leaderboard,
  };

  dispatch.game.updateTournamentReducer({
    tournamentId,
    tournament,
  });

  const raceTextLength = state.game.racesModel[raceId].text.length;
  const leaderboard = generateLeaderboard(
    state.game.playerLogsModel,
    raceId,
    raceTextLength,
  );
  dispatch.game.addLeaderboardReducer({
    leaderboardId: raceId,
    leaderboard,
  });
};
