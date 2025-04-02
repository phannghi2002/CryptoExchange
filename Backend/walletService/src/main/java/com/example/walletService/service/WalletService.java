package com.example.walletService.service;

import com.example.walletService.constant.TransactionType;
import com.example.walletService.dto.request.ChangeCoinRequest;
import com.example.walletService.dto.request.WalletUpdateRequest;
import com.example.walletService.dto.request.WalletUpdateTradeRequest;
import com.example.walletService.entity.Wallets;
import com.example.walletService.repository.WalletsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.BiFunction;

@Service
public class WalletService {
    @Autowired
    private WalletsRepository walletsRepository;

    public Wallets updateWallet(WalletUpdateRequest request) {
        Wallets wallet = walletsRepository.findByUserId(request.getUserId())
                .orElseGet(() -> Wallets.builder()
                        .userId(request.getUserId())
                        .fiatBalance(new HashMap<>())
                        .cryptoBalance(new HashMap<>())
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build());

//        // Nếu là giao dịch SWAP
//        if (request.getTransactionType() == TransactionType.SWAP) {
//            if (request.getOriginCurrency() != null && request.getTargetCurrency() != null &&
//                    request.getOriginAmount() != null && request.getTargetAmount() != null) {
//                processSwap(wallet, request);
//            } else {
//                throw new IllegalArgumentException("Thông tin hoán đổi không hợp lệ.");
//            }
//        }

        // Nếu là giao dịch SWAP HOẶC SWAP_ORDER_LIMIT
        if (request.getTransactionType() == TransactionType.SWAP_ORDER_LIMIT || request.getTransactionType() == TransactionType.SWAP) {
            if (request.getOriginCurrency() != null && request.getTargetCurrency() != null &&
                    request.getOriginAmount() != null && request.getTargetAmount() != null) {
                processSwap(wallet, request);
            } else {
                throw new IllegalArgumentException("Thông tin hoán đổi không hợp lệ.");
            }
        }
        // Nếu là DEPOSIT hoặc WITHDRAW
        else if (request.getCurrency() != null && request.getAmount() != null) {
            if (isFiatCurrency(request.getCurrency())) {
                updateBalance(wallet.getFiatBalance(), request);
            } else {
                updateBalance(wallet.getCryptoBalance(), request);
            }
        }

        wallet.setUpdatedAt(LocalDateTime.now());
        return walletsRepository.save(wallet);
    }

    private void processSwap(Wallets wallet, WalletUpdateRequest request) {
        Map<String, BigDecimal> cryptoBalance = wallet.getCryptoBalance();

        // Lấy số dư của đồng coin nguồn
        BigDecimal originBalance = cryptoBalance.getOrDefault(request.getOriginCurrency(), BigDecimal.ZERO);

        // Kiểm tra số dư có đủ không
        if (originBalance.compareTo(request.getOriginAmount()) < 0) {
            throw new IllegalArgumentException("Số dư không đủ để hoán đổi.");
        }

        // Trừ số dư từ đồng coin nguồn
        cryptoBalance.put(request.getOriginCurrency(), originBalance.subtract(request.getOriginAmount()));

        // Cộng số dư vào đồng coin đích
        cryptoBalance.put(request.getTargetCurrency(),
                cryptoBalance.getOrDefault(request.getTargetCurrency(), BigDecimal.ZERO)
                        .add(request.getTargetAmount())
        );

        //  Xóa các coin có số dư < THRESHOLD
        cryptoBalance.entrySet().removeIf(entry -> entry.getValue().abs().compareTo(THRESHOLD) < 0);

        if(request.getTransactionType() ==  TransactionType.SWAP_ORDER_LIMIT){

        }
    }

    private static final BigDecimal THRESHOLD = new BigDecimal("1E-6"); // Ngưỡng tối thiểu

    private void updateBalance(Map<String, BigDecimal> balanceMap, WalletUpdateRequest request) {
        BigDecimal currentBalance = balanceMap.getOrDefault(request.getCurrency(), BigDecimal.ZERO);

        if (request.getTransactionType() == TransactionType.DEPOSIT) {
            balanceMap.put(request.getCurrency(), currentBalance.add(request.getAmount()));
        } else if (request.getTransactionType() == TransactionType.WITHDRAW && currentBalance.compareTo(request.getAmount()) >= 0) {
            balanceMap.put(request.getCurrency(), currentBalance.subtract(request.getAmount()));
        } else {
            throw new IllegalArgumentException("Số dư không đủ để thực hiện giao dịch.");
        }

        // 🔥 Xóa các mục có số dư < THRESHOLD
        balanceMap.entrySet().removeIf(entry -> entry.getValue().abs().compareTo(THRESHOLD) < 0);
    }

    private boolean isFiatCurrency(String currency) {
        return List.of("VND", "USD", "EUR").contains(currency);
    }

    public Wallets getWalletOfUser(String userId) {
        return walletsRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ví cho userID: " + userId));
    }

 //  public List<Wallets> updateWalletTrade(String buyerId, String sellerId,BigDecimal amountFiat,BigDecimal amountCrypto, String cryptoType) {

        public List<Wallets> updateWalletTrade(WalletUpdateTradeRequest request) {
        // Tìm ví của người mua
        Wallets buyerWallet = walletsRepository.findByUserId(request.getBuyerId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ví người mua!"));

        // Tìm ví của người bán
        Wallets sellerWallet = walletsRepository.findByUserId(request.getSellerId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ví người bán!"));

        // Kiểm tra số dư fiat của người mua
        BigDecimal buyerFiatBalance = buyerWallet.getFiatBalance().getOrDefault("VND", BigDecimal.ZERO);
        if (buyerFiatBalance.compareTo(request.getAmountFiat()) < 0) {
            throw new RuntimeException("Số dư ví fiat không đủ!");
        }

        // Kiểm tra số dư crypto của người bán
        BigDecimal sellerCryptoBalance = sellerWallet.getCryptoBalance().getOrDefault(request.getCryptoType(), BigDecimal.ZERO);
        if (sellerCryptoBalance.compareTo(request.getAmountCrypto()) < 0) {
            throw new RuntimeException("Số dư ví crypto không đủ!");
        }
        // Cập nhật số dư fiat của người mua (trừ tiền)
        buyerWallet.getFiatBalance().put("VND", buyerFiatBalance.subtract(request.getAmountFiat()));

        // Cập nhật số dư fiat của người bán (cộng tiền)
        BigDecimal sellerFiatBalance = sellerWallet.getFiatBalance().getOrDefault("VND", BigDecimal.ZERO);
        sellerWallet.getFiatBalance().put("VND", sellerFiatBalance.add(request.getAmountFiat()));

        // Cập nhật số dư crypto của người mua (cộng crypto)
        BigDecimal buyerCryptoBalance = buyerWallet.getCryptoBalance().getOrDefault(request.getCryptoType(), BigDecimal.ZERO);
        buyerWallet.getCryptoBalance().put(request.getCryptoType(), buyerCryptoBalance.add(request.getAmountCrypto()));

        //khong can tru tien nua tai vi khi dat lenh thi ta da tru tien roi
//        // Cập nhật số dư crypto của người bán (trừ crypto)
//        sellerWallet.getCryptoBalance().put(request.getCryptoType(), sellerCryptoBalance.subtract(request.getAmountCrypto()));

        // Cập nhật thời gian
        buyerWallet.setUpdatedAt(LocalDateTime.now());
        sellerWallet.setUpdatedAt(LocalDateTime.now());

        // Lưu vào database
        walletsRepository.save(buyerWallet);
        walletsRepository.save(sellerWallet);


        return Arrays.asList(buyerWallet, sellerWallet);
    }

//    public Wallets substractCoinWallet(String userId, ChangeCoinRequest request) {
//        Wallets wallet = walletsRepository.findByUserId(userId)
//                .orElse(null);
//
//        if (wallet == null) {
//            // Xử lý trường hợp wallet không tồn tại
//            return null; // Hoặc throw exception
//        }
//
//        Map<String, BigDecimal> cryptoBalance = wallet.getCryptoBalance();
//        String currency = request.getCurrency();
//        BigDecimal amount = request.getAmount();
//
//        if (cryptoBalance.containsKey(currency)) {
//            BigDecimal currentBalance = cryptoBalance.get(currency);
//            BigDecimal newBalance = currentBalance.subtract(amount);
//
//            if (newBalance.compareTo(BigDecimal.ZERO) < 0) {
//                // Xử lý trường hợp số dư không đủ
//                return null; // Hoặc throw exception
//            }
//
//            cryptoBalance.put(currency, newBalance);
//            wallet.setCryptoBalance(cryptoBalance);
//            return walletsRepository.save(wallet);
//        } else {
//            // Xử lý trường hợp currency không tồn tại trong cryptoBalance
//            return null; // Hoặc throw exception
//        }
//    }
//
//    public Wallets returnCoinWallet(String userId, ChangeCoinRequest request) {
//        Wallets wallet = walletsRepository.findByUserId(userId)
//                .orElse(null);
//
//        if (wallet == null) {
//            // Xử lý trường hợp wallet không tồn tại
//            return null; // Hoặc throw exception
//        }
//
//        Map<String, BigDecimal> cryptoBalance = wallet.getCryptoBalance();
//        String currency = request.getCurrency();
//        BigDecimal amount = request.getAmount();
//
//        if (cryptoBalance.containsKey(currency)) {
//            BigDecimal currentBalance = cryptoBalance.get(currency);
//            BigDecimal newBalance = currentBalance.add(amount);
//
//            if (newBalance.compareTo(BigDecimal.ZERO) < 0) {
//                // Xử lý trường hợp số dư không đủ
//                return null; // Hoặc throw exception
//            }
//
//            cryptoBalance.put(currency, newBalance);
//            wallet.setCryptoBalance(cryptoBalance);
//            return walletsRepository.save(wallet);
//        } else {
//            // Xử lý trường hợp currency không tồn tại trong cryptoBalance
//            return null; // Hoặc throw exception
//        }
//    }

    public Wallets changeCoinWallet(String userId, ChangeCoinRequest request, BiFunction<BigDecimal, BigDecimal, BigDecimal> operation) {
        Wallets wallet = walletsRepository.findByUserId(userId)
                .orElse(null);

        if (wallet == null) {
            // Xử lý trường hợp wallet không tồn tại
            return null; // Hoặc throw exception
        }

        Map<String, BigDecimal> cryptoBalance = wallet.getCryptoBalance();
        String currency = request.getCurrency();
        BigDecimal amount = request.getAmount();

        if (cryptoBalance.containsKey(currency)) {
            BigDecimal currentBalance = cryptoBalance.get(currency);
            BigDecimal newBalance = operation.apply(currentBalance, amount);

            if (newBalance.compareTo(BigDecimal.ZERO) < 0) {
                // Xử lý trường hợp số dư không đủ
                return null; // Hoặc throw exception
            }

            cryptoBalance.put(currency, newBalance);
            wallet.setCryptoBalance(cryptoBalance);
            return walletsRepository.save(wallet);
        } else {
            // Xử lý trường hợp currency không tồn tại trong cryptoBalance
            return null; // Hoặc throw exception
        }
    }

    public Wallets substractCoinWallet(String userId, ChangeCoinRequest request) {
        return changeCoinWallet(userId, request, BigDecimal::subtract);
    }

    public Wallets returnCoinWallet(String userId, ChangeCoinRequest request) {
        return changeCoinWallet(userId, request, BigDecimal::add);
    }
}