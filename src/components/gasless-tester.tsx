"use client";

import { useState } from "react";
// import { GaslessSDK, GaslessConfig, GaslessTransferParams } from "../../../gasless-sdk/src/index";
import { GaslessSDK, GaslessConfig, GaslessTransferParams } from "gasless-sdk";
import { createPublicClient, http, type Address } from "viem";
import { mainnet } from "viem/chains";

interface TestResult {
  test: string;
  result: string;
  status: "success" | "error";
}

export function GaslessTester() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);

  const runTests = async () => {
    setIsLoading(true);
    setResults([]);

    try {
      // Create a public client
      const publicClient = createPublicClient({
        chain: mainnet,
        transport: http("https://eth.llamarpc.com"),
      });

      // Configure the gasless SDK
      const config: GaslessConfig = {
        chainId: 1,
        rpcUrl: "https://eth.llamarpc.com",
        relayerUrl: "https://your-relayer.com",
        forwarderAddress:
          "0x1234567890123456789012345678901234567890" as Address,
      };

      // Initialize the SDK with type assertion to bypass version compatibility
      // @ts-expect-error - viem version mismatch between gasless-sdk and project
      const sdk = new GaslessSDK(config, publicClient);

      const testResults: TestResult[] = [];

      // Test 1: Hello World
      try {
        const helloMessage = sdk.helloWorld();
        testResults.push({
          test: "Hello World",
          result: helloMessage,
          status: "success",
        });
      } catch (error) {
        testResults.push({
          test: "Hello World",
          result: `Error: ${(error as Error).message}`,
          status: "error",
        });
      }

      // Test 2: Get Config
      try {
        const retrievedConfig = sdk.getConfig();
        testResults.push({
          test: "Get Config",
          result: `Chain ID: ${retrievedConfig.chainId}, RPC: ${retrievedConfig.rpcUrl}`,
          status: "success",
        });
      } catch (error) {
        testResults.push({
          test: "Get Config",
          result: `Error: ${(error as Error).message}`,
          status: "error",
        });
      }

      // Test 3: Mock Gasless Transfer
      try {
        const transferParams: GaslessTransferParams = {
          token: "0xA0b86a33E6441E1063D8Bb9Afe3c8A1e67CD7C4d" as Address,
          to: "0x742d35Cc6634C0532925a3b8D4c9db96C0F4E7d8" as Address,
          amount: 1000000000000000000n, // 1 token
          userAddress: "0x8ba1f109551bD432803012645Hac136c52DCfAd5" as Address,
        };

        const result = await sdk.transferGasless(transferParams);
        testResults.push({
          test: "Mock Gasless Transfer",
          result: `Success: ${result.success}, Hash: ${result.hash}`,
          status: "success",
        });
      } catch (error) {
        testResults.push({
          test: "Mock Gasless Transfer",
          result: `Error: ${(error as Error).message}`,
          status: "error",
        });
      }

      setResults(testResults);
    } catch (error) {
      setResults([
        {
          test: "Initialization",
          result: `Fatal Error: ${(error as Error).message}`,
          status: "error",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Gasless SDK Tester
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Test the gasless SDK functionality with a simple UI interface.
        </p>
      </div>

      <div className="mb-6">
        <button
          onClick={runTests}
          disabled={isLoading}
          className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Running Tests...
            </>
          ) : (
            "Run Gasless Tests"
          )}
        </button>
      </div>

      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Test Results:
          </h3>
          <div className="space-y-3">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  result.status === "success"
                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                    : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                      result.status === "success"
                        ? "bg-green-100 dark:bg-green-800"
                        : "bg-red-100 dark:bg-red-800"
                    }`}
                  >
                    {result.status === "success" ? (
                      <svg
                        className="w-3 h-3 text-green-600 dark:text-green-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-3 h-3 text-red-600 dark:text-red-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4
                      className={`font-medium ${
                        result.status === "success"
                          ? "text-green-900 dark:text-green-100"
                          : "text-red-900 dark:text-red-100"
                      }`}
                    >
                      {result.test}
                    </h4>
                    <p
                      className={`mt-1 text-sm break-all ${
                        result.status === "success"
                          ? "text-green-700 dark:text-green-300"
                          : "text-red-700 dark:text-red-300"
                      }`}
                    >
                      {result.result}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
