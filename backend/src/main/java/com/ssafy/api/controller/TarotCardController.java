package com.ssafy.api.controller;

import com.ssafy.api.request.TarotCardRequest;
import com.ssafy.api.request.UpdateImageRequest;
import com.ssafy.db.entity.TarotCard;
import com.ssafy.api.service.TarotCardService;
import io.swagger.annotations.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Api(value = "타로카드 API", tags = {"TarotCard"})
@RestController
@RequestMapping("/api/v1/tarot-card")
public class TarotCardController {

    @Autowired
    private TarotCardService tarotCardService;

    // **1. 생성 - 세트 번호, 이름 번호, 이미지**
    @PostMapping
    @ApiOperation(value = "타로 카드 생성", notes = "세트 번호, 카드 번호, 이미지 URL을 통해 타로 카드를 생성합니다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 400, message = "잘못된 요청"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<TarotCard> createTarotCard(@RequestBody @ApiParam(value = "타로 카드 생성 정보", required = true) TarotCardRequest request) {
        TarotCard createdCard = tarotCardService.createTarotCard(request.getSetNumber(), request.getCardNumber(), request.getCardImage());
        return ResponseEntity.ok(createdCard);
    }

    // **2. 조회 - 세트 번호 기반 조회**
    @GetMapping("/set/{setNumber}")
    @ApiOperation(value = "세트 번호 기반 타로 카드 조회", notes = "특정 세트 번호에 해당하는 모든 타로 카드를 조회합니다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 404, message = "세트를 찾을 수 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<List<TarotCard>> getCardsBySetNumber(@PathVariable @ApiParam(value = "세트 번호", required = true) Integer setNumber) {
        List<TarotCard> cards = tarotCardService.getCardsBySetNumber(setNumber);
        return ResponseEntity.ok(cards);
    }

    // **3. 조회 - 카드 하나 조회 (세트 번호와 카드 번호로)**
    @GetMapping("/set/{setNumber}/card/{cardNumber}")
    @ApiOperation(value = "특정 타로 카드 조회", notes = "세트 번호와 카드 번호를 통해 특정 타로 카드를 조회합니다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 404, message = "카드를 찾을 수 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<TarotCard> getTarotCardBySetAndNumber(
            @PathVariable @ApiParam(value = "세트 번호", required = true) Integer setNumber,
            @PathVariable @ApiParam(value = "카드 번호", required = true) Integer cardNumber) {
        Optional<TarotCard> optionalTarotCard = tarotCardService.getTarotCardBySetAndNumber(setNumber, cardNumber);
        if (optionalTarotCard.isPresent()) {
            return ResponseEntity.ok(optionalTarotCard.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // **4. 수정 - 이미지**
    @PutMapping("/set/{setNumber}/card/{cardNumber}")
    @ApiOperation(value = "타로 카드 이미지 수정", notes = "세트 번호와 카드 번호를 통해 특정 타로 카드의 이미지를 수정합니다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 404, message = "카드를 찾을 수 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<TarotCard> updateTarotCardImage(
            @PathVariable @ApiParam(value = "세트 번호", required = true) Integer setNumber,
            @PathVariable @ApiParam(value = "카드 번호", required = true) Integer cardNumber,
            @RequestBody @ApiParam(value="새 이미지 정보", required=true) UpdateImageRequest request) {
        TarotCard updatedCard = tarotCardService.updateTarotCardImage(setNumber, cardNumber, request.getNewImage());
        return ResponseEntity.ok(updatedCard);
    }

    // **5. 삭제 - 하나씩 삭제**
    @DeleteMapping("/set/{setNumber}/card/{cardNumber}")
    @ApiOperation(value="특정 타로 카드 삭제", notes="세트 번호와 카드 번호를 통해 특정 타로 카드를 삭제합니다.")
    @ApiResponses({
            @ApiResponse(code=204,message="성공"),
            @ApiResponse(code=404,message="카드를 찾을 수 없음"),
            @ApiResponse(code=500,message="서버 오류")
    })
    public ResponseEntity<Void> deleteTarotCard(
            @PathVariable @ApiParam(value="세트 번호",required=true) Integer setNumber,
            @PathVariable @ApiParam(value="카드 번호",required=true) Integer cardNumber){
        tarotCardService.deleteCard(setNumber, cardNumber);
        return ResponseEntity.noContent().build();
    }

    // **6. 삭제 - 세트 삭제**
    @DeleteMapping("/set/{setNumber}")
    @ApiOperation(value="타로 카드 세트 삭제", notes="특정 세트를 삭제하고 해당 세트의 모든 카드를 제거합니다.")
    @ApiResponses({
            @ApiResponse(code=204,message="성공"),
            @ApiResponse(code=404,message="세트를 찾을 수 없음"),
            @ApiResponse(code=500,message="서버 오류")
    })
    public ResponseEntity<Void> deleteCardsBySet(
            @PathVariable @ApiParam(value="세트 번호",required=true) Integer setNumber){
        tarotCardService.deleteCardsBySet(setNumber);
        return ResponseEntity.noContent().build();
    }
}
