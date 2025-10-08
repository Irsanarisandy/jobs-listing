## Decisions

- Use [Jest](https://docs.expo.dev/develop/unit-testing/) for unit/integration testing.
   - I didn't include snapshot tests as I consider it to be ineffective.
   - I made tests for everything except for pages, as the components, hooks and utils are already isolated and have their own tests.
- Use [Nativewind](https://www.nativewind.dev/docs) for styling.
   - Enable to use TailwindCSS styling for React Native.
- Use [Axios](https://axios-http.com/docs/intro) for handling HTTP requests.
- Use [Zustand](https://zustand.docs.pmnd.rs/getting-started/introduction) for state management.
   - Decide to use this to avoid too much hassle caused by using React Context and Reducer.
- Expo already have file-based routing, so no need to implement React Navigation.
- For this coding task, there's no point on implementing protected routes, as we can only test for one specific worker.
   - i.e. the provided id will be used as the default worker id, mentioned in `utils/fixedValues.ts`.
- Use [Toast](https://github.com/calintamas/react-native-toast-message) to display errors or success when approving/rejecting jobs.
- I don't have a Macbook or an iPhone, so I can't test for iOS devices. Have tested for other devices.
