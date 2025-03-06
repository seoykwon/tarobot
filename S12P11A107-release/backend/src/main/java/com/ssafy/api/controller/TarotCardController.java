package com.ssafy.api.controller;

import com.ssafy.api.request.TarotCardReq;
import com.ssafy.api.request.UpdateImageReq;
import com.ssafy.db.entity.TarotCard;
import com.ssafy.api.service.TarotCardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Tag(name = "TarotCard", description = "타로카드 API")
@RestController
@RequestMapping("/api/v1/tarot-cards")
public class TarotCardController {

    @Autowired
    private TarotCardService tarotCardService;

    // **1. 생성 - 세트 번호, 이름 번호, 이미지**
    @PostMapping
    @Operation(summary = "타로 카드 생성", description = "세트 번호, 카드 번호, 이미지 URL을 통해 타로 카드를 생성합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<TarotCard> createTarotCard(
            @RequestBody @Parameter(description = "타로 카드 생성 정보", required = true) TarotCardReq request) {
        TarotCard createdCard = tarotCardService.createTarotCard(request.getSetNumber(), request.getCardNumber(), request.getCardImage());
        return ResponseEntity.ok(createdCard);
    }

    // **2. 조회 - 세트 번호 기반 조회**
    @GetMapping("/set/{setNumber}")
    @Operation(summary = "세트 번호 기반 타로 카드 조회", description = "특정 세트 번호에 해당하는 모든 타로 카드를 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "404", description = "세트를 찾을 수 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<List<TarotCard>> getCardsBySetNumber(
            @PathVariable @Parameter(description = "세트 번호", required = true) Integer setNumber) {
        List<TarotCard> cards = tarotCardService.getCardsBySetNumber(setNumber);
        return ResponseEntity.ok(cards);
    }

    // **3. 조회 - 카드 하나 조회 (세트 번호와 카드 번호로)**
    @GetMapping("/set/{setNumber}/card/{cardNumber}")
    @Operation(summary = "특정 타로 카드 조회", description = "세트 번호와 카드 번호를 통해 특정 타로 카드를 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "404", description = "카드를 찾을 수 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<TarotCard> getTarotCardBySetAndNumber(
            @PathVariable @Parameter(description = "세트 번호", required = true) Integer setNumber,
            @PathVariable @Parameter(description = "카드 번호", required = true) Integer cardNumber) {
        Optional<TarotCard> optionalTarotCard =
                tarotCardService.getTarotCardBySetAndNumber(setNumber, cardNumber);
        return optionalTarotCard.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // **4. 수정 - 이미지**
    @PutMapping("/set/{setNumber}/card/{cardNumber}")
    @Operation(summary = "타로 카드 이미지 수정", description = "세트 번호와 카드 번호를 통해 특정 타로 카드의 이미지를 수정합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "404", description = "카드를 찾을 수 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<TarotCard> updateTarotCardImage(
            @PathVariable @Parameter(description = "세트 번호", required = true) Integer setNumber,
            @PathVariable @Parameter(description = "카드 번호", required = true) Integer cardNumber,
            @RequestBody @Parameter(description="새 이미지 정보", required=true) UpdateImageReq request) {
        TarotCard updatedCard =
                tarotCardService.updateTarotCardImage(setNumber, cardNumber, request.getNewImage());
        return ResponseEntity.ok(updatedCard);
    }

    // **5. 삭제 - 하나씩 삭제**
    @DeleteMapping("/set/{setNumber}/card/{cardNumber}")
    @Operation(summary="특정 타로 카드 삭제", description="세트 번호와 카드 번호를 통해 특정 타로 카드를 삭제합니다.")
    @ApiResponses({
            @ApiResponse(responseCode="204",description="성공"),
            @ApiResponse(responseCode="404",description="카드를 찾을 수 없음"),
            @ApiResponse(responseCode="500",description="서버 오류")
    })
    public ResponseEntity<Void> deleteTarotCard(
            @PathVariable @Parameter(description="세트 번호",required=true) Integer setNumber,
            @PathVariable @Parameter(description="카드 번호",required=true) Integer cardNumber){
        tarotCardService.deleteCard(setNumber, cardNumber);
        return ResponseEntity.noContent().build();
    }

    // **6. 삭제 - 세트 삭제**
    @DeleteMapping("/set/{setNumber}")
    @Operation(summary="타로 카드 세트 삭제", description="특정 세트를 삭제하고 해당 세트의 모든 카드를 제거합니다.")
    @ApiResponses({
            @ApiResponse(responseCode="204",description="성공"),
            @ApiResponse(responseCode="404",description="세트를 찾을 수 없음"),
            @ApiResponse(responseCode="500",description="서버 오류")
    })
    public ResponseEntity<Void> deleteCardsBySet(
            @PathVariable @Parameter(description="세트 번호",required=true) Integer setNumber){
        tarotCardService.deleteCardsBySet(setNumber);
        return ResponseEntity.noContent().build();
    }
}
