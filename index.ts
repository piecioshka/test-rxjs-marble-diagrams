import { ofType } from 'redux-observable';
import { TestScheduler } from 'rxjs/testing';
import { isEqual } from 'lodash-es';
import { of, map, Observable, catchError } from 'rxjs';

type ExampleAction = ActionWithNumber | ActionWithString;

interface ActionWithNumber {
  type: 'ActionWithNumber';
  content: number;
}
interface ActionWithString {
  type: 'ActionWithString';
  content: string;
}

const action1Epic = (action$: Observable<ExampleAction>) =>
  action$.pipe(
    ofType<ExampleAction, 'ActionWithNumber'>('ActionWithNumber'),
    map(({ content }) => {
      console.log('aaaaa', content);
      return content + content;
    }),
    catchError((err, err$) => {
      console.log('err', err);
      return err$;
    })
  );

const testScheduler = new TestScheduler((actual, expected) => {
  const status = isEqual(actual, expected);
  console.log('TestScheduler', status, { actual, expected });
});

testScheduler.run(({ expectObservable }) => {
  const o1 = of({ type: 'ActionWithNumber' as const, content: 128 });

  const expected = '(a|)';
  const epic$ = action1Epic(o1);
  epic$.subscribe();

  expectObservable(epic$).toBe(expected, { a: 256 });
});
