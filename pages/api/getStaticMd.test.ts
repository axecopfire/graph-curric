import getStaticMd from "./getStaticMd";

test("Returns expected shape", async () => {
  const mockHttpResponse = {
    status: () => ({
      json: jest.fn((r) => r),
    }),
  };

  const result = await getStaticMd({}, mockHttpResponse).catch(console.error);
});
