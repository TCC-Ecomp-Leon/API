ENV='TEST' ts-node src/env.ts; 
ENV='TEST' ts-node tests_e2e/test_data.ts; 
ENV='TEST' ts-node src/mocks/index.ts;

ENV='TEST' jest --findRelatedTests $1