import { EitherMonad, Monad } from '../types';

export const tryOrCatch = <R>(callback: () => R): EitherMonad<R> => {
  try {
    return Right(callback())
  } catch (error) {
    return Left(error) as unknown as EitherMonad<R>;
  }
}

export const Right = <T>(value: T): EitherMonad<T> => ({
  catch: <R>() => Right(value) as unknown as EitherMonad<R>,
  chain: (fn) => fn(value),
  getOrElse: () => value,
  map: (fn) => Right(fn(value)),
});

export const Left = <T>(value: T): EitherMonad<T> => ({
  catch: (fn) => Right(fn(value)),
  chain: <R, U>() => Left(value) as unknown as U,
  getOrElse: () => value,
  map: <R>() => Left(value) as unknown as EitherMonad<R>,
});

export const Identity = <T>(value: T): Monad<T> => ({
  chain: (fn) => fn(value),
  getOrElse: () => value,
  map: (fn) => Identity(fn(value)),
});
