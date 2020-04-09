const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');
const Blockchain = require('../blockchain');

describe('TransactionPool', () => {

    let transactionPool, transaction, senderWallet;

    beforeEach(() => {
        transactionPool = new TransactionPool();
        senderWallet = new Wallet();
        transaction = new Transaction({senderWallet, recipient: 'Jess T', amount: 50});
    });

    describe('setTransaction()', () => {
        it('adds a transaction', () => {
            transactionPool.setTransaction(transaction);
            expect(transactionPool.transactionMap[transaction.id]).toBe(transaction);
        });
    });

    describe('existing transaction', () => {
        it('returns an existing transaction given an input address', () => {
            transactionPool.setTransaction(transaction);
            expect(transactionPool.existingTransaction({inputAddress: senderWallet.publicKey})).toBe(transaction);
        });
    });

    describe('valid transactions', () => {
        let validTransactions, errorMock;

        beforeEach(() => {
           validTransactions = [];
           errorMock = jest.fn();
           global.console.error = errorMock;

           for(let i = 0; i <= 10; i++) {
               transaction = new Transaction({
                   senderWallet,
                   recipient: 'some-recipient',
                   amount: 50
               });

               if(i % 3 === 0) {
                   transaction.input.amount = 999999;
               } else if (i % 3 === 1) {
                   transaction.input.signature = new Wallet().sign(transaction);
               } else {
                   validTransactions.push(transaction);
               }

               transactionPool.setTransaction(transaction);
           }
        });

        it('returns valid transactions', () => {
           expect(transactionPool.validTransactions()).toStrictEqual(validTransactions);
        });

        it('logs errors for the invalid transactions', () => {
            transactionPool.validTransactions();
            expect(errorMock).toHaveBeenCalled();
        });
    });

    describe('clear()', () => {
        it('clears transactions', () => {
            transactionPool.clear();
            expect(transactionPool.transactionMap).toEqual({});
        });
    });

    describe('clearBlockchainTransactions()', () => {
        it('clears the pool of any existing blockchain tx', () => {
            const blockchain = new Blockchain();
            const expectedTransactionMap = {};

            for(let i = 0; i <= 6; i++) {
                const tx = new Wallet().createTransaction({
                    recipient: 'foo',
                    amount: 20,
                });

                transactionPool.setTransaction(tx);

                if(i % 2 === 0) {
                    blockchain.addBlock({data: [tx]});
                } else {
                    expectedTransactionMap[tx.id] = tx;
                }
            }

            transactionPool.clearChainTx({chain: blockchain.chain});

            expect(transactionPool.transactionMap).toEqual(expectedTransactionMap);
        });
    });
});