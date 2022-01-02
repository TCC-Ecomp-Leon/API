ENV='TEST' yarn ts-node-dev tests_e2e/test_data.ts ;
ENV='TEST' yarn ts-node src/mocks/index.ts; 
ENV='TEST' yarn jest --findRelatedTests $1