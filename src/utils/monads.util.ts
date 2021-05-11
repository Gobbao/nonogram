import { EitherMonad, Monad } from '../types';
import { always } from './functions.util';

export const tryOrCatch = <R>(callback: () => R): EitherMonad<R> => {
  try {
    return Right(callback())
  } catch (error) {
    return Left(error) as unknown as EitherMonad<R>;
  }
}

export const Right = <T>(value: T): EitherMonad<T> => ({
  call: (fn) => Right(fn(value)).map(always(value)),
  catch: <R>() => Right(value) as unknown as EitherMonad<R>,
  chain: (fn) => fn(value),
  getOrElse: () => value,
  map: (fn) => Right(fn(value)),
});

export const Left = <T>(value: T): EitherMonad<T> => ({
  call: () => Left(value),
  catch: (fn) => Right(fn(value)),
  chain: <R, U>() => Left(value) as unknown as U,
  getOrElse: () => value,
  map: <R>() => Left(value) as unknown as EitherMonad<R>,
});

export const Identity = <T>(value: T): Monad<T> => ({
  call: (fn) => Identity(fn(value)).map(always(value)),
  chain: (fn) => fn(value),
  getOrElse: () => value,
  map: (fn) => Identity(fn(value)),
});
