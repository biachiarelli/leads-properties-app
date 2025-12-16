import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { Select } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { Textarea } from 'primeng/textarea';
import { PropriedadeService } from '../../../services/propriedade.service';
import { LeadService } from '../../../services/lead.service';
import { PropriedadeRural, Lead } from '../../../models/lead.model';

@Component({
  selector: 'app-property-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    Select,
    ButtonModule,
    Textarea,
  ],
  templateUrl: './property-form.component.html',
  styleUrls: ['./property-form.component.scss'],
})
export class PropertyFormComponent implements OnInit {
  @Input() propriedade: PropriedadeRural | null = null;
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  formData: PropriedadeRural = {
    leadId: '',
    cultura: '',
    areaHectares: 0,
    geometria: null,
  };

  leads: Lead[] = [];
  geometriaJson = '';

  constructor(
    private propriedadeService: PropriedadeService,
    private leadService: LeadService
  ) {}

  ngOnInit(): void {
    this.loadLeads();

    if (this.propriedade) {
      this.formData = { ...this.propriedade };
      if (this.propriedade.geometria) {
        this.geometriaJson = JSON.stringify(
          this.propriedade.geometria,
          null,
          2
        );
      }
    }
  }

  loadLeads(): void {
    this.leadService.getLeads().subscribe({
      next: (data) => {
        this.leads = data;
      },
      error: (error) => {
        console.error('Erro ao carregar leads:', error);
      },
    });
  }

  onSubmit(): void {
    // Parse geometria JSON
    if (this.geometriaJson) {
      try {
        this.formData.geometria = JSON.parse(this.geometriaJson);
      } catch (e) {
        console.error('JSON inválido para geometria');
        return;
      }
    }

    if (this.propriedade?.id) {
      // Atualizar
      this.propriedadeService
        .updatePropriedade(this.propriedade.id, this.formData)
        .subscribe({
          next: () => {
            this.save.emit();
          },
          error: (error) => {
            console.error('Erro ao atualizar propriedade:', error);
          },
        });
    } else {
      // Criar
      this.propriedadeService.createPropriedade(this.formData).subscribe({
        next: () => {
          this.save.emit();
        },
        error: (error) => {
          console.error('Erro ao criar propriedade:', error);
        },
      });
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}

